'use client';

import { useState } from 'react';

interface PreviewItem {
  id: string;
  title: string | null;
  width: number | null;
  height: number | null;
  thumbnailUrl: string | null;
}

interface TagGroup {
  name: string;
  count: number;
  items: PreviewItem[];
}

const ROTATE_MS = 5000;

export function TagCarousel({ tags }: { tags: TagGroup[] }) {
  const [active, setActive] = useState(0);

  if (tags.length === 0) return null;

  function next() {
    setActive((i) => (i + 1) % tags.length);
  }

  const current = tags[active];

  return (
    <div>
      <div
        className="grid border-t border-b border-ink/10"
        style={{ gridTemplateColumns: `repeat(${tags.length}, 1fr)` }}
      >
        {tags.map((tag, i) => (
          <button
            key={tag.name}
            onClick={() => setActive(i)}
            className={`text-left px-5 py-5 hover:bg-paper-light transition-colors ${
              i < tags.length - 1 ? 'border-r border-ink/10' : ''
            }`}
          >
            <div className="text-sm font-medium capitalize mb-0.5">
              {tag.name}
            </div>
            <div className="text-xs text-slate mb-2.5">{tag.count} pieces</div>
            <div className="h-0.5 bg-ink/10 rounded-full overflow-hidden">
              {i === active && (
                <div
                  key={active}
                  className="h-full bg-ink"
                  style={{ animation: `moonvault-progress ${ROTATE_MS}ms linear forwards` }}
                  onAnimationEnd={next}
                />
              )}
            </div>
          </button>
        ))}
      </div>

      <div className="px-8 sm:px-14 py-10">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {current.items.map((item) =>
            item.thumbnailUrl && item.width && item.height ? (
              <div
                key={item.id}
                className="rounded-md overflow-hidden bg-ink/10"
                style={{ aspectRatio: `${item.width} / ${item.height}` }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`${process.env.NEXT_PUBLIC_API_URL}${item.thumbnailUrl}`}
                  alt={item.title ?? 'Untitled artwork'}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : null,
          )}
        </div>
      </div>
    </div>
  );
}
