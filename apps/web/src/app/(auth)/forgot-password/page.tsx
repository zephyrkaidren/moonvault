'use client';

import { useState } from 'react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await fetch('/api/auth/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    setLoading(false);
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="w-full max-w-sm bg-paper-light rounded-lg p-8 border border-ink/10 text-center">
        <p className="text-sm">
          If an account with that email exists, a reset link has been sent.
        </p>
        <a href="/login" className="text-accent text-sm mt-4 inline-block">
          Back to log in
        </a>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-sm bg-paper-light rounded-lg p-8 border border-ink/10"
    >
      <h1 className="font-display font-semibold text-xl mb-2">
        Reset your password
      </h1>
      <p className="text-sm text-slate mb-5">
        Enter your email and we&apos;ll send you a reset link.
      </p>

      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        className="w-full mb-4 px-3 py-2 rounded border border-ink/20 bg-paper text-sm"
      />

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-accent text-paper-light rounded-full py-2 text-sm font-medium disabled:opacity-60"
      >
        {loading ? 'Sending…' : 'Send reset link'}
      </button>

      <p className="text-sm text-slate mt-4 text-center">
        <a href="/login" className="text-accent">
          Back to log in
        </a>
      </p>
    </form>
  );
}
