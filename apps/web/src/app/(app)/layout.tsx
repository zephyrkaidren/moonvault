import { cookies } from 'next/headers';
import { LogoutButton } from '@/components/layout/logout-button';

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const isLoggedIn = Boolean(cookieStore.get('moonvault_token'));

  return (
    <div className="min-h-screen">
      <header className="flex items-center justify-between px-8 py-4 border-b border-ink/10">
        <h1 className="font-display font-semibold text-xl mb-6">Moonvault</h1>
        <nav className="flex items-center gap-6 text-sm text-slate">
          <a href="/gallery">Explore</a>
          <a href="/gallery/ranking">Ranking</a>
          {isLoggedIn ? (
            <>
              <a href="/profile">Profile</a>
              <a href="/dashboard">Vault</a>
              <LogoutButton />
            </>
          ) : (
            <a href="/login">Log in</a>
          )}
        </nav>
      </header>
      <main className="p-8">{children}</main>
    </div>
  );
}
