import { useState, type FormEvent } from 'react';
import { Logo } from '../components/Logo';
import { FormField, inputClassName } from '../components/FormField';
import { Button } from '../components/Button';
import { useAuth } from '../context/AuthContext';

interface LoginScreenProps {
  onGoToSignup: () => void;
}

export function LoginScreen({ onGoToSignup }: LoginScreenProps) {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email.trim(), password);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-cream px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center gap-3">
          <Logo />
          <p className="font-body text-sm text-neutral-500">Sign in to your account</p>
        </div>

        <div className="rounded-xl border border-neutral-100 bg-white p-8 shadow-card">
          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            <FormField label="Email" htmlFor="login-email">
              <input
                id="login-email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className={inputClassName()}
                required
              />
            </FormField>

            <FormField label="Password" htmlFor="login-password">
              <input
                id="login-password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className={inputClassName()}
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
              disabled={loading || !email || !password}
            >
              {loading ? 'Signing in…' : 'Sign in'}
            </Button>
          </form>
        </div>

        <p className="mt-6 text-center font-body text-sm text-neutral-500">
          Don't have an account?{' '}
          <button
            type="button"
            onClick={onGoToSignup}
            className="font-semibold text-primary-700 underline-offset-2 hover:underline"
          >
            Create one
          </button>
        </p>
      </div>
    </div>
  );
}
