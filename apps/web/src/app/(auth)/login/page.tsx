'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { extractErrorMessages } from '@/lib/error-message';

export default function LoginPage() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErrors([]);

    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier, password }),
    });

    setLoading(false);

    if (!res.ok) {
      const body = await res.json().catch(() => null);
      setErrors(extractErrorMessages(body));
      return;
    }

    router.push('/dashboard');
    router.refresh();
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-sm bg-paper-light rounded-lg p-8 border border-ink/10"
    >
      <h1 className="font-display font-semibold text-xl mb-6">Moonvault</h1>

      {errors.length > 0 && (
        <div className="mb-4" role="alert">
          {errors.map((err, i) => (
            <p key={i} className="text-accent text-sm">
              {err}
            </p>
          ))}
        </div>
      )}

      <label className="block text-sm mb-1" htmlFor="identifier">
        Email or username
      </label>
      <input
        id="identifier"
        required
        value={identifier}
        onChange={(e) => setIdentifier(e.target.value)}
        className="w-full mb-4 px-3 py-2 rounded border border-ink/20 bg-paper text-sm"
      />

      <label className="block text-sm mb-1" htmlFor="password">
        Password
      </label>
      <input
        id="password"
        type="password"
        required
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full mb-2 px-3 py-2 rounded border border-ink/20 bg-paper text-sm"
      />

      <div className="text-right mb-4">
        <a href="/forgot-password" className="text-xs text-slate">
          Forgot password?
        </a>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-accent text-paper-light rounded-full py-2 text-sm font-medium disabled:opacity-60"
      >
        {loading ? 'Logging in…' : 'Log in'}
      </button>

      <p className="text-sm text-slate mt-4 text-center">
        No account?{' '}
        <a href="/register" className="text-accent">
          Register
        </a>
      </p>
    </form>
  );
}
