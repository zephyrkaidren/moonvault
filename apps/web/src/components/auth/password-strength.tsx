const LEVELS = [
  { label: 'Too short', color: '#a63a2e' },
  { label: 'Weak', color: '#a63a2e' },
  { label: 'Fair', color: '#93762f' },
  { label: 'Good', color: '#4f8f6b' },
  { label: 'Strong', color: '#4f8f6b' },
];

function scorePassword(password: string): number {
  if (password.length < 8) return 0;
  let score = 1;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  return Math.min(score, 4);
}

export function PasswordStrength({ password }: { password: string }) {
  if (!password) return null;
  const level = scorePassword(password);
  const { label, color } = LEVELS[level];

  return (
    <div className="mb-3">
      <div className="flex gap-1 mb-1">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-1 flex-1 rounded-full"
            style={{ backgroundColor: i < level ? color : 'rgba(32,30,27,0.1)' }}
          />
        ))}
      </div>
      <span className="text-xs" style={{ color }}>
        {label}
      </span>
    </div>
  );
}
