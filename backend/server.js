import express from 'express';
import multer from 'multer';
import cors from 'cors';
import pg from 'pg';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { GoogleGenerativeAI } from '@google/generative-ai';

const { Pool } = pg;
const app = express();
const PORT = 3001;
const JWT_SECRET = process.env.SESSION_SECRET || 'hisaab-dev-secret-change-in-prod';
const JWT_EXPIRES_IN = '7d';

// ---------------------------------------------------------------------------
// Database
// ---------------------------------------------------------------------------

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function initDb() {
  // Users table
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      password_hash TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);

  // Transactions table (create fresh if not exists)
  await pool.query(`
    CREATE TABLE IF NOT EXISTS transactions (
      id TEXT PRIMARY KEY,
      user_id TEXT REFERENCES users(id) ON DELETE CASCADE,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      source TEXT NOT NULL CHECK (source IN ('scan', 'manual')),
      transaction_type TEXT NOT NULL CHECK (transaction_type IN ('income', 'expense')),
      vendor_name TEXT NOT NULL,
      date DATE NOT NULL,
      category TEXT NOT NULL,
      total_amount NUMERIC(12, 2) NOT NULL,
      items JSONB NOT NULL DEFAULT '[]',
      tax_amount NUMERIC(12, 2),
      notes TEXT
    );
  `);

  // Migrate existing table: add user_id column if it doesn't exist yet
  await pool.query(`
    ALTER TABLE transactions ADD COLUMN IF NOT EXISTS user_id TEXT REFERENCES users(id) ON DELETE CASCADE;
    CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions (date DESC);
    CREATE INDEX IF NOT EXISTS idx_transactions_user ON transactions (user_id);
  `);

  // Budgets table — one row per user+category
  await pool.query(`
    CREATE TABLE IF NOT EXISTS budgets (
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      category TEXT NOT NULL,
      monthly_limit NUMERIC(12, 2) NOT NULL,
      PRIMARY KEY (user_id, category)
    );
  `);

  // Recurring transaction templates
  await pool.query(`
    CREATE TABLE IF NOT EXISTS recurring_templates (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      vendor_name TEXT NOT NULL,
      category TEXT NOT NULL,
      transaction_type TEXT NOT NULL CHECK (transaction_type IN ('income', 'expense')),
      total_amount NUMERIC(12, 2) NOT NULL,
      day_of_month INTEGER NOT NULL CHECK (day_of_month BETWEEN 1 AND 28),
      notes TEXT,
      is_active BOOLEAN NOT NULL DEFAULT TRUE,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
    CREATE INDEX IF NOT EXISTS idx_recurring_user ON recurring_templates (user_id);
  `);

  // Add columns to transactions for tracking auto-generated recurring entries
  await pool.query(`
    ALTER TABLE transactions ADD COLUMN IF NOT EXISTS recurring_template_id TEXT REFERENCES recurring_templates(id) ON DELETE SET NULL;
    ALTER TABLE transactions ADD COLUMN IF NOT EXISTS recurring_month TEXT;
  `);
}

// ---------------------------------------------------------------------------
// Middleware
// ---------------------------------------------------------------------------

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 20 * 1024 * 1024 } });

const allowedOrigins = process.env.REPLIT_DOMAINS
  ? process.env.REPLIT_DOMAINS.split(',').map(d => `https://${d.trim()}`)
  : ['http://localhost:5000'];
app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(express.json());

// ---------------------------------------------------------------------------
// Auth middleware
// ---------------------------------------------------------------------------

function requireAuth(req, res, next) {
  const header = req.headers['authorization'];
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  const token = header.slice(7);
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.userId = payload.userId;
    req.userEmail = payload.email;
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

function normaliseRow(r) {
  return {
    ...r,
    date: r.date instanceof Date ? r.date.toISOString().slice(0, 10) : r.date,
    total_amount: parseFloat(r.total_amount),
    tax_amount: r.tax_amount != null ? parseFloat(r.tax_amount) : null,
  };
}

// ---------------------------------------------------------------------------
// Auth routes
// ---------------------------------------------------------------------------

app.post('/api/auth/signup', async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email and password are required' });
  }
  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters' });
  }
  try {
    const existing = await pool.query('SELECT id FROM users WHERE email = $1', [email.toLowerCase()]);
    if (existing.rows.length > 0) {
      return res.status(409).json({ error: 'An account with this email already exists' });
    }
    const password_hash = await bcrypt.hash(password, 12);
    const id = crypto.randomUUID();
    const { rows } = await pool.query(
      'INSERT INTO users (id, name, email, password_hash) VALUES ($1, $2, $3, $4) RETURNING id, name, email',
      [id, name.trim(), email.toLowerCase().trim(), password_hash],
    );
    const user = rows[0];
    const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
    console.log(`[Hisaab] New user signed up: ${user.email}`);
    res.status(201).json({ token, user: { id: user.id, name: user.name, email: user.email } });
  } catch (err) {
    console.error('[Hisaab] Signup error:', err.message);
    res.status(500).json({ error: 'Could not create account' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }
  try {
    const { rows } = await pool.query(
      'SELECT id, name, email, password_hash FROM users WHERE email = $1',
      [email.toLowerCase().trim()],
    );
    if (rows.length === 0) {
      return res.status(401).json({ error: 'Incorrect email or password' });
    }
    const user = rows[0];
    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      return res.status(401).json({ error: 'Incorrect email or password' });
    }
    const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
    console.log(`[Hisaab] User logged in: ${user.email}`);
    res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
  } catch (err) {
    console.error('[Hisaab] Login error:', err.message);
    res.status(500).json({ error: 'Login failed' });
  }
});

app.get('/api/auth/me', requireAuth, async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT id, name, email FROM users WHERE id = $1', [req.userId]);
    if (rows.length === 0) return res.status(404).json({ error: 'User not found' });
    res.json({ user: rows[0] });
  } catch (err) {
    res.status(500).json({ error: 'Could not fetch profile' });
  }
});

// ---------------------------------------------------------------------------
// Transaction CRUD routes — all scoped to the authenticated user
// ---------------------------------------------------------------------------

app.get('/api/transactions', requireAuth, async (req, res) => {
  try {
    const { rows } = await pool.query(
      'SELECT * FROM transactions WHERE user_id = $1 ORDER BY date DESC, created_at DESC',
      [req.userId],
    );
    res.json(rows.map(normaliseRow));
  } catch (err) {
    console.error('[Hisaab] GET /api/transactions error:', err.message);
    res.status(500).json({ error: 'Database error' });
  }
});

app.post('/api/transactions', requireAuth, async (req, res) => {
  const { id, created_at, source, transaction_type, vendor_name, date, category, total_amount, items, tax_amount, notes } = req.body;
  try {
    const { rows } = await pool.query(
      `INSERT INTO transactions (id, user_id, created_at, source, transaction_type, vendor_name, date, category, total_amount, items, tax_amount, notes)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
       ON CONFLICT (id) DO UPDATE SET
         vendor_name = EXCLUDED.vendor_name,
         total_amount = EXCLUDED.total_amount,
         items = EXCLUDED.items,
         notes = EXCLUDED.notes
       RETURNING *`,
      [id, req.userId, created_at, source, transaction_type, vendor_name, date, category, total_amount, JSON.stringify(items ?? []), tax_amount ?? null, notes ?? null],
    );
    res.status(201).json(normaliseRow(rows[0]));
  } catch (err) {
    console.error('[Hisaab] POST /api/transactions error:', err.message);
    res.status(500).json({ error: 'Database error' });
  }
});

app.put('/api/transactions/:id', requireAuth, async (req, res) => {
  const { id } = req.params;
  const patch = req.body;
  const allowed = ['vendor_name', 'date', 'category', 'transaction_type', 'total_amount', 'items', 'tax_amount', 'notes', 'source'];
  const sets = [];
  const values = [];
  let idx = 1;
  for (const key of allowed) {
    if (key in patch) {
      sets.push(`${key} = $${idx++}`);
      values.push(key === 'items' ? JSON.stringify(patch[key]) : patch[key]);
    }
  }
  if (sets.length === 0) return res.status(400).json({ error: 'No valid fields to update' });
  values.push(req.userId, id);
  try {
    const { rows } = await pool.query(
      `UPDATE transactions SET ${sets.join(', ')} WHERE user_id = $${idx} AND id = $${idx + 1} RETURNING *`,
      values,
    );
    if (rows.length === 0) return res.status(404).json({ error: 'Transaction not found' });
    res.json(normaliseRow(rows[0]));
  } catch (err) {
    console.error('[Hisaab] PUT /api/transactions error:', err.message);
    res.status(500).json({ error: 'Database error' });
  }
});

app.delete('/api/transactions/:id', requireAuth, async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM transactions WHERE user_id = $1 AND id = $2', [req.userId, id]);
    res.json({ ok: true });
  } catch (err) {
    console.error('[Hisaab] DELETE /api/transactions error:', err.message);
    res.status(500).json({ error: 'Database error' });
  }
});

// ---------------------------------------------------------------------------
// AI Receipt extraction
// ---------------------------------------------------------------------------

const SYSTEM_PROMPT = `You are Hisaab, a bookkeeping assistant for small businesses in Pakistan.
When given an image of a receipt, bill, or invoice, extract the financial
information and return it as JSON only.

Return:
{
  "transaction_type": "expense" | "income",
  "vendor_name": "name of the shop, supplier, or client",
  "date": "date on the receipt in YYYY-MM-DD or null if unclear",
  "items": [
    {
      "description": "item or service name",
      "quantity": number or null,
      "unit_price": number or null,
      "total": number
    }
  ],
  "subtotal": number,
  "tax_amount": number or null,
  "total_amount": number,
  "currency": "PKR",
  "category": one of: "Inventory" | "Utilities" | "Transport" |
              "Equipment" | "Services" | "Salary" | "Food" | "Other",
  "notes": "anything else relevant on the receipt"
}

If an amount is unclear, include your best estimate and add
"confidence": "low" on that field. Never invent a vendor name — if
unclear, set vendor_name to "Unknown – please check".
Output ONLY valid JSON. No preamble or explanation.`;

const ERROR_MESSAGES = {
  noKey: 'AI service is not configured — please add your receipt manually',
  badImage: 'AI could not read this receipt clearly — please add manually',
  apiDown: 'Could not reach AI — please try again or add manually',
  malformed: 'AI could not read this receipt clearly — please add manually',
};

app.post('/api/extract-receipt', requireAuth, upload.single('receipt'), async (req, res) => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error('[Hisaab] GEMINI_API_KEY is not set');
    return res.status(503).json({ userMessage: ERROR_MESSAGES.noKey });
  }
  if (!req.file) return res.status(400).json({ userMessage: 'No image file received' });

  const { buffer, mimetype } = req.file;
  const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/heic'];
  if (!validTypes.includes(mimetype)) {
    return res.status(400).json({ userMessage: 'Unsupported image type — use JPG, PNG, or HEIC' });
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    const result = await model.generateContent([
      SYSTEM_PROMPT,
      { inlineData: { data: buffer.toString('base64'), mimeType: mimetype } },
    ]);
    const rawText = result.response.text().trim();
    const jsonText = rawText.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '').trim();

    let extracted;
    try {
      extracted = JSON.parse(jsonText);
    } catch {
      console.error('[Hisaab] Gemini returned non-JSON:', rawText.slice(0, 200));
      return res.status(422).json({ userMessage: ERROR_MESSAGES.malformed });
    }

    const unclearFields = [];
    if (!extracted.date) unclearFields.push('date');
    if (extracted.vendor_name === 'Unknown – please check') unclearFields.push('vendor_name');
    if (typeof extracted.total_amount !== 'number') unclearFields.push('total_amount');

    console.log(`[Hisaab] Extracted receipt: ${extracted.vendor_name} — PKR ${extracted.total_amount}`);
    return res.json({
      transaction_type: extracted.transaction_type ?? 'expense',
      vendor_name: extracted.vendor_name ?? 'Unknown – please check',
      date: extracted.date ?? null,
      items: Array.isArray(extracted.items) ? extracted.items : [],
      subtotal: extracted.subtotal ?? extracted.total_amount ?? 0,
      tax_amount: extracted.tax_amount ?? null,
      total_amount: extracted.total_amount ?? 0,
      currency: 'PKR',
      category: extracted.category ?? 'Other',
      notes: extracted.notes ?? null,
      ...(unclearFields.length > 0 && { unclear_fields: unclearFields }),
    });
  } catch (err) {
    const msg = err?.message ?? String(err);
    console.error('[Hisaab] Gemini API error:', msg);
    if (msg.includes('429') || msg.includes('quota')) {
      return res.status(429).json({ userMessage: 'AI is temporarily busy — please try again in a moment or add manually' });
    }
    if (msg.includes('400')) return res.status(422).json({ userMessage: ERROR_MESSAGES.badImage });
    return res.status(502).json({ userMessage: ERROR_MESSAGES.apiDown });
  }
});

// ---------------------------------------------------------------------------
// Recurring template routes
// ---------------------------------------------------------------------------

app.get('/api/recurring', requireAuth, async (req, res) => {
  try {
    const { rows } = await pool.query(
      'SELECT * FROM recurring_templates WHERE user_id = $1 ORDER BY day_of_month ASC, created_at DESC',
      [req.userId],
    );
    res.json(rows);
  } catch (err) {
    console.error('[Hisaab] GET /api/recurring error:', err.message);
    res.status(500).json({ error: 'Database error' });
  }
});

app.post('/api/recurring', requireAuth, async (req, res) => {
  const { vendor_name, category, transaction_type, total_amount, day_of_month, notes } = req.body;
  if (!vendor_name || !category || !transaction_type || !total_amount || !day_of_month) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  try {
    const id = crypto.randomUUID();
    const { rows } = await pool.query(
      `INSERT INTO recurring_templates (id, user_id, vendor_name, category, transaction_type, total_amount, day_of_month, notes)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [id, req.userId, vendor_name, category, transaction_type, total_amount, day_of_month, notes ?? null],
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error('[Hisaab] POST /api/recurring error:', err.message);
    res.status(500).json({ error: 'Database error' });
  }
});

app.put('/api/recurring/:id', requireAuth, async (req, res) => {
  const { id } = req.params;
  const allowed = ['vendor_name', 'category', 'transaction_type', 'total_amount', 'day_of_month', 'notes', 'is_active'];
  const sets = [];
  const values = [];
  let idx = 1;
  for (const key of allowed) {
    if (key in req.body) {
      sets.push(`${key} = $${idx++}`);
      values.push(req.body[key]);
    }
  }
  if (sets.length === 0) return res.status(400).json({ error: 'No valid fields to update' });
  values.push(req.userId, id);
  try {
    const { rows } = await pool.query(
      `UPDATE recurring_templates SET ${sets.join(', ')} WHERE user_id = $${idx} AND id = $${idx + 1} RETURNING *`,
      values,
    );
    if (rows.length === 0) return res.status(404).json({ error: 'Template not found' });
    res.json(rows[0]);
  } catch (err) {
    console.error('[Hisaab] PUT /api/recurring error:', err.message);
    res.status(500).json({ error: 'Database error' });
  }
});

app.delete('/api/recurring/:id', requireAuth, async (req, res) => {
  try {
    await pool.query('DELETE FROM recurring_templates WHERE user_id = $1 AND id = $2', [req.userId, req.params.id]);
    res.json({ ok: true });
  } catch (err) {
    console.error('[Hisaab] DELETE /api/recurring error:', err.message);
    res.status(500).json({ error: 'Database error' });
  }
});

// Auto-generate this month's transactions from active templates (idempotent)
app.post('/api/recurring/apply', requireAuth, async (req, res) => {
  const { monthKey } = req.body; // "2026-06"
  if (!monthKey || !/^\d{4}-\d{2}$/.test(monthKey)) {
    return res.status(400).json({ error: 'monthKey must be YYYY-MM' });
  }
  try {
    const { rows: templates } = await pool.query(
      'SELECT * FROM recurring_templates WHERE user_id = $1 AND is_active = TRUE',
      [req.userId],
    );
    let created = 0;
    for (const t of templates) {
      // Check if already applied for this month
      const existing = await pool.query(
        'SELECT id FROM transactions WHERE user_id = $1 AND recurring_template_id = $2 AND recurring_month = $3',
        [req.userId, t.id, monthKey],
      );
      if (existing.rows.length > 0) continue;

      // Build date: clamp to last day of month
      const [year, month] = monthKey.split('-').map(Number);
      const lastDay = new Date(year, month, 0).getDate();
      const day = Math.min(t.day_of_month, lastDay);
      const date = `${monthKey}-${String(day).padStart(2, '0')}`;

      const txnId = crypto.randomUUID();
      await pool.query(
        `INSERT INTO transactions (id, user_id, created_at, source, transaction_type, vendor_name, date, category, total_amount, items, notes, recurring_template_id, recurring_month)
         VALUES ($1, $2, NOW(), 'manual', $3, $4, $5, $6, $7, '[]', $8, $9, $10)`,
        [txnId, req.userId, t.transaction_type, t.vendor_name, date, t.category, t.total_amount, t.notes, t.id, monthKey],
      );
      created++;
    }
    console.log(`[Hisaab] Recurring apply for ${req.userId} ${monthKey}: ${created} new`);
    res.json({ created });
  } catch (err) {
    console.error('[Hisaab] POST /api/recurring/apply error:', err.message);
    res.status(500).json({ error: 'Database error' });
  }
});

// ---------------------------------------------------------------------------
// Budget routes
// ---------------------------------------------------------------------------

app.get('/api/budgets', requireAuth, async (req, res) => {
  try {
    const { rows } = await pool.query(
      'SELECT category, monthly_limit FROM budgets WHERE user_id = $1 ORDER BY category',
      [req.userId],
    );
    res.json(rows);
  } catch (err) {
    console.error('[Hisaab] GET /api/budgets error:', err.message);
    res.status(500).json({ error: 'Database error' });
  }
});

// Full replace — accepts [{category, monthly_limit}], deletes all existing first
app.post('/api/budgets', requireAuth, async (req, res) => {
  const items = req.body;
  if (!Array.isArray(items)) return res.status(400).json({ error: 'Expected an array' });

  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await client.query('DELETE FROM budgets WHERE user_id = $1', [req.userId]);
    for (const { category, monthly_limit } of items) {
      if (category && monthly_limit > 0) {
        await client.query(
          'INSERT INTO budgets (user_id, category, monthly_limit) VALUES ($1, $2, $3)',
          [req.userId, category, monthly_limit],
        );
      }
    }
    await client.query('COMMIT');
    const { rows } = await client.query(
      'SELECT category, monthly_limit FROM budgets WHERE user_id = $1',
      [req.userId],
    );
    res.json(rows);
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('[Hisaab] POST /api/budgets error:', err.message);
    res.status(500).json({ error: 'Database error' });
  } finally {
    client.release();
  }
});

// ---------------------------------------------------------------------------
// Health check & config
// ---------------------------------------------------------------------------

app.get('/api/health', (_req, res) => res.json({ ok: true }));
app.get('/api/config', (_req, res) => res.json({ aiEnabled: Boolean(process.env.GEMINI_API_KEY) }));

initDb()
  .then(() => {
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`[Hisaab] Backend listening on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('[Hisaab] Failed to initialise database:', err.message);
    process.exit(1);
  });
