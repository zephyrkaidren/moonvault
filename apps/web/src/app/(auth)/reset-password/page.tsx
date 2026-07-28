'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { PasswordStrength } from '@/components/password-strength';
import { extractErrorMessages } from '@/lib/error-message';

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token') ?? '';
  const [newPassword, setNewPassword] = useState('');
  const [errors, setErrors] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErrors([]);

    const res = await fetch('/api/auth/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, newPassword }),
    });

    setLoading(false);

    if (!res.ok) {
      const body = await res.json().catch(() => null);
      setErrors(extractErrorMessages(body));
      return;
    }

    setSuccess(true);
    setTimeout(() => router.push('/login'), 2000);
  }

  if (!token) {
    return (
      <div className="w-full max-w-sm bg-paper-light rounded-lg p-8 border border-ink/10 text-center">
        <p className="text-sm text-accent">
          This reset link is missing or malformed.
        </p>
        <a href="/forgot-password" className="text-accent text-sm mt-4 inline-block">
          Request a new one
        </a>
      </div>
    );
  }

  if (success) {
    return (
      <div className="w-full max-w-sm bg-paper-light rounded-lg p-8 border border-ink/10 text-center">
        <p className="text-sm">Password updated. Redirecting to log in…</p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-sm bg-paper-light rounded-lg p-8 border border-ink/10"
    >
      <h1 className="font-display font-semibold text-xl mb-5">
        Set a new password
      </h1>

      {errors.length > 0 && (
        <div className="mb-4" role="alert">
          {errors.map((err, i) => (
            <p key={i} className="text-accent text-sm">
              {err}
            </p>
          ))}
        </div>
      )}

      <input
        type="password"
        required
        minLength={8}
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        placeholder="New password"
        className="w-full mb-1 px-3 py-2 rounded border border-ink/20 bg-paper text-sm"
      />
      <PasswordStrength password={newPassword} />

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-accent text-paper-light rounded-full py-2 text-sm font-medium disabled:opacity-60 mt-2"
      >
        {loading ? 'Updating…' : 'Update password'}
      </button>
    </form>
  );
}
