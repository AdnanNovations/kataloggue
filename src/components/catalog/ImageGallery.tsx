import { useState, useRef, useEffect } from 'react';

interface Props {
  images: string[];
  alt: string;
}

export default function ImageGallery({ images, alt }: Props) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [zoomed, setZoomed] = useState(false);
  const touchRef = useRef<{ startX: number; startY: number } | null>(null);
  const mainRef = useRef<HTMLDivElement>(null);

  // Close zoom on Escape
  useEffect(() => {
    if (!zoomed) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setZoomed(false);
      if (e.key === 'ArrowLeft') setActiveIdx(i => (i > 0 ? i - 1 : images.length - 1));
      if (e.key === 'ArrowRight') setActiveIdx(i => (i < images.length - 1 ? i + 1 : 0));
    }
    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [zoomed, images.length]);

  function handleTouchStart(e: React.TouchEvent) {
    const t = e.touches[0];
    touchRef.current = { startX: t.clientX, startY: t.clientY };
  }

  function handleTouchEnd(e: React.TouchEvent) {
    if (!touchRef.current) return;
    const t = e.changedTouches[0];
    const dx = t.clientX - touchRef.current.startX;
    const dy = Math.abs(t.clientY - touchRef.current.startY);
    touchRef.current = null;
    if (Math.abs(dx) < 50 || dy > Math.abs(dx)) return;
    if (dx < 0 && activeIdx < images.length - 1) setActiveIdx(activeIdx + 1);
    if (dx > 0 && activeIdx > 0) setActiveIdx(activeIdx - 1);
  }

  if (images.length === 0) {
    return (
      <div className="aspect-square flex items-center justify-center" style={{ color: 'var(--cs-detail-subtext)', backgroundColor: 'var(--cs-detail-label-bg)' }}>
        <svg className="w-16 h-16 sm:w-24 sm:h-24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col" style={{ backgroundColor: 'var(--cs-detail-label-bg)' }}>
        {/* Main image */}
        <div
          ref={mainRef}
          className="aspect-square overflow-hidden cursor-zoom-in relative"
          onClick={() => setZoomed(true)}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <img
            src={images[activeIdx]}
            alt={`${alt} - ${activeIdx + 1}`}
            className="w-full h-full object-cover"
            width="600"
            height="600"
          />
          {/* Image counter for mobile */}
          {images.length > 1 && (
            <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded-full sm:hidden">
              {activeIdx + 1}/{images.length}
            </div>
          )}
        </div>

        {/* Thumbnails */}
        {images.length > 1 && (
          <div className="hidden sm:flex gap-1.5 p-2 overflow-x-auto">
            {images.map((url, idx) => (
              <button
                key={url}
                type="button"
                onClick={() => setActiveIdx(idx)}
                className={`w-16 h-16 flex-shrink-0 rounded overflow-hidden border-2 transition-colors ${
                  idx === activeIdx ? 'border-green-500' : 'border-transparent hover:border-gray-300'
                }`}
              >
                <img src={url} alt={`${alt} ${idx + 1}`} className="w-full h-full object-cover" loading="lazy" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Zoom modal */}
      {zoomed && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
          onClick={() => setZoomed(false)}
        >
          <button
            className="absolute top-4 right-4 text-white text-3xl z-10 w-10 h-10 flex items-center justify-center"
            onClick={() => setZoomed(false)}
          >
            &times;
          </button>

          {images.length > 1 && (
            <>
              <button
                className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 text-white text-3xl z-10 w-10 h-10 flex items-center justify-center bg-black/40 rounded-full"
                onClick={(e) => { e.stopPropagation(); setActiveIdx(i => (i > 0 ? i - 1 : images.length - 1)); }}
              >
                &#8249;
              </button>
              <button
                className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 text-white text-3xl z-10 w-10 h-10 flex items-center justify-center bg-black/40 rounded-full"
                onClick={(e) => { e.stopPropagation(); setActiveIdx(i => (i < images.length - 1 ? i + 1 : 0)); }}
              >
                &#8250;
              </button>
            </>
          )}

          <img
            src={images[activeIdx]}
            alt={`${alt} - ${activeIdx + 1}`}
            className="max-w-full max-h-full object-contain p-4"
            onClick={(e) => e.stopPropagation()}
          />

          {images.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
              {images.map((_, idx) => (
                <button
                  key={idx}
                  onClick={(e) => { e.stopPropagation(); setActiveIdx(idx); }}
                  className={`w-2 h-2 rounded-full transition-colors ${idx === activeIdx ? 'bg-white' : 'bg-white/40'}`}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
}
