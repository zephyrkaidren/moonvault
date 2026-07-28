import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { TagCarousel } from '@/components/tag-carousel';

interface TagCount {
  name: string;
  count: number;
}

interface PreviewItem {
  id: string;
  title: string | null;
  width: number | null;
  height: number | null;
  thumbnailUrl: string | null;
}

export default async function HomePage() {
  const cookieStore = await cookies();
  const isLoggedIn = Boolean(cookieStore.get('moonvault_token'));

  if (isLoggedIn) {
    redirect('/gallery');
  }

  const tagsRes = await fetch(`${process.env.API_URL}/gallery/tags`, {
    cache: 'no-store',
  });
  const rawTags: TagCount[] = tagsRes.ok ? await tagsRes.json() : [];
  const topTags = rawTags.slice(0, 5);

  const tagGroups = await Promise.all(
    topTags.map(async (tag) => {
      const res = await fetch(
        `${process.env.API_URL}/gallery?tag=${encodeURIComponent(tag.name)}&limit=6`,
        { cache: 'no-store' },
      );
      const data = res.ok ? await res.json() : { items: [] };
      return { name: tag.name, count: tag.count, items: data.items as PreviewItem[] };
    }),
  );

  return (
    <div className="min-h-screen bg-paper">
      <header className="flex items-center justify-between px-8 sm:px-14 py-6">
        <span className="font-display font-semibold text-xl">Moonvault</span>
        <nav className="flex items-center gap-6 text-sm">
          <a href="/login" className="text-slate hover:text-ink">
            Login
          </a>
          <a
            href="/register"
            className="bg-ink text-paper-light rounded-full px-5 py-2 font-medium"
          >
            Sign up
          </a>
        </nav>
      </header>

      <section className="px-8 sm:px-14 pt-16 sm:pt-24 pb-16 sm:pb-20">
        <div className="text-xs tracking-[0.15em] text-slate font-mono uppercase mb-6">
          Moonvault Art Vault
        </div>
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-end">
          <h1 className="font-display font-semibold text-5xl sm:text-6xl lg:text-7xl leading-[1.05] max-w-3xl">
            Your art, stored and shown your way.
          </h1>

          <div className="lg:ml-auto">
            <p className="text-slate text-base sm:text-lg max-w-sm lg:pb-3">
              Store every illustration privately at full quality. Choose which
              pieces join the public gallery - tagged, bookmarked, and browsed
              by people who care about the work.
            </p>
          </div>
        </div>
        <a
          href="/register"
          className="inline-block mt-10 bg-accent text-paper-light rounded-full px-8 py-3.5 text-base font-medium"
        >
          Start your vault
        </a>
      </section>

      {tagGroups.length > 0 ? (
        <TagCarousel tags={tagGroups} />
      ) : (
        <p className="text-center text-sm text-slate py-14">
          No public art yet — be the first to share something.
        </p>
      )}
    </div>
  );
}
