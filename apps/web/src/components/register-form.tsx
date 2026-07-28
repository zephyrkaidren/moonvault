'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PasswordStrength } from './password-strength';
import { extractErrorMessages } from '@/lib/error-message';

export function RegisterForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [errors, setErrors] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErrors([]);

    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, username, password, displayName }),
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
    <form onSubmit={handleSubmit}>
      <h1 className="font-display font-semibold text-xl mb-1">Moonvault</h1>
      <p className="text-sm text-slate mb-5">
        Join to store your work and share what you choose.
      </p>

      {errors.length > 0 && (
        <div className="mb-4" role="alert">
          {errors.map((err, i) => (
            <p key={i} className="text-accent text-sm">
              {err}
            </p>
          ))}
        </div>
      )}

      <label className="block text-sm mb-1" htmlFor="displayName">
        Display name
      </label>
      <input
        id="displayName"
        required
        value={displayName}
        onChange={(e) => setDisplayName(e.target.value)}
        className="w-full mb-4 px-3 py-2 rounded border border-ink/20 bg-paper text-sm"
      />

      <label className="block text-sm mb-1" htmlFor="username">
        Username
      </label>
      <input
        id="username"
        required
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="letters, numbers, underscores only"
        className="w-full mb-4 px-3 py-2 rounded border border-ink/20 bg-paper text-sm"
      />

      <label className="block text-sm mb-1" htmlFor="email">
        Email
      </label>
      <input
        id="email"
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full mb-4 px-3 py-2 rounded border border-ink/20 bg-paper text-sm"
      />

      <label className="block text-sm mb-1" htmlFor="password">
        Password
      </label>
      <input
        id="password"
        type="password"
        required
        minLength={8}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full mb-1 px-3 py-2 rounded border border-ink/20 bg-paper text-sm"
      />
      <PasswordStrength password={password} />

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-accent text-paper-light rounded-full py-2 text-sm font-medium disabled:opacity-60 mt-2"
      >
        {loading ? 'Creating account…' : 'Create account'}
      </button>

      <p className="text-sm text-slate mt-4 text-center">
        Already have an account?{' '}
        <a href="/login" className="text-accent">
          Log in
        </a>
      </p>
    </form>
  );
}
