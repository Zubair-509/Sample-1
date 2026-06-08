import { useState, type FormEvent } from 'react';
import { Logo } from '../components/Logo';
import { FormField, inputClassName } from '../components/FormField';
import { Button } from '../components/Button';
import { useAuth } from '../context/AuthContext';

interface SignupScreenProps {
  onGoToLogin: () => void;
}

export function SignupScreen({ onGoToLogin }: SignupScreenProps) {
  const { signup } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    try {
      await signup(name.trim(), email.trim(), password);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not create account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-cream px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center gap-3">
          <Logo />
          <p className="font-body text-sm text-neutral-500">Create your free account</p>
        </div>

        <div className="rounded-xl border border-neutral-100 bg-white p-8 shadow-card">
          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            <FormField label="Full Name" htmlFor="signup-name">
              <input
                id="signup-name"
                type="text"
                autoComplete="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className={inputClassName()}
                required
              />
            </FormField>

            <FormField label="Email" htmlFor="signup-email">
              <input
                id="signup-email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className={inputClassName()}
                required
              />
            </FormField>

            <FormField label="Password" htmlFor="signup-password" error={password.length > 0 && password.length < 6 ? 'Minimum 6 characters' : undefined}>
              <input
                id="signup-password"
                type="password"
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className={inputClassName(password.length > 0 && password.length < 6)}
                required
              />
            </FormField>

            {error && (
              <p className="rounded-md bg-expense-bg px-3 py-2 font-body text-sm text-expense-text">
                {error}
              </p>
            )}

            <Button
              type="submit"
              variant="primary"
              className="w-full"
              disabled={loading || !name || !email || password.length < 6}
            >
              {loading ? 'Creating account…' : 'Create account'}
            </Button>
          </form>
        </div>

        <p className="mt-6 text-center font-body text-sm text-neutral-500">
          Already have an account?{' '}
          <button
            type="button"
            onClick={onGoToLogin}
            className="font-semibold text-primary-700 underline-offset-2 hover:underline"
          >
            Sign in
          </button>
        </p>
      </div>
    </div>
  );
}
