import { RegisterForm } from '@/components/register-form';
import { resolveImageUrl } from '@/lib/resolve-image-url';

interface PreviewItem {
  id: string;
  thumbnailUrl: string | null;
  width: number | null;
  height: number | null;
}

export default async function RegisterPage() {
  let previewItems: PreviewItem[] = [];
  try {
    const res = await fetch(`${process.env.API_URL}/gallery?limit=6`, {
      cache: 'no-store',
    });
    if (res.ok) {
      const data = await res.json();
      previewItems = data.items;
    }
  } catch {
    previewItems = [];
  }

  return (
    <div className="w-full max-w-3xl flex rounded-xl overflow-hidden border border-ink/10 min-h-105">
      <div className="flex-1 bg-ink p-3 hidden sm:block">
        {previewItems.length > 0 ? (
          <div className="columns-2 gap-2">
            {previewItems.map((item) =>
              item.thumbnailUrl && item.width && item.height ? (
                <div
                  key={item.id}
                  className="break-inside-avoid mb-2 rounded-md overflow-hidden"
                >
                  <img
                    src={resolveImageUrl(item.thumbnailUrl) ?? undefined}
                    alt=""
                    style={{ aspectRatio: `${item.width} / ${item.height}` }}
                    className="w-full object-cover"
                  />
                </div>
              ) : null,
            )}
          </div>
        ) : (
          <div className="h-full flex items-center justify-center text-paper-light/50 text-sm">
            Your art could be here.
          </div>
        )}
      </div>
      <div className="flex-1 bg-paper-light p-8 flex flex-col justify-center">
        <RegisterForm />
      </div>
    </div>
  );
}
