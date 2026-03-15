import { useState, useRef, useEffect } from 'react';

interface Props {
  safeHtml: string;
  maxHeight?: number;
}

export default function ExpandableDescription({ safeHtml, maxHeight = 200 }: Props) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [needsExpand, setNeedsExpand] = useState(false);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const el = contentRef.current;
    if (el && el.scrollHeight > maxHeight) {
      setNeedsExpand(true);
    }
  }, [safeHtml, maxHeight]);

  return (
    <div className="relative">
      <div
        ref={contentRef}
        className="prose prose-sm max-w-none overflow-hidden transition-[max-height] duration-300 ease-in-out"
        style={{
          maxHeight: !needsExpand || expanded ? 'none' : `${maxHeight}px`,
          color: 'var(--cs-detail-text)',
          '--tw-prose-body': 'var(--cs-detail-text)',
          '--tw-prose-headings': 'var(--cs-product-name)',
          '--tw-prose-links': 'var(--cs-accent)',
          '--tw-prose-bold': 'var(--cs-detail-text)',
          '--tw-prose-bullets': 'var(--cs-detail-subtext)',
          '--tw-prose-counters': 'var(--cs-detail-subtext)',
          '--tw-prose-quotes': 'var(--cs-detail-text)',
          '--tw-prose-quote-borders': 'var(--cs-detail-border)',
          '--tw-prose-hr': 'var(--cs-detail-border)',
        } as React.CSSProperties}
        dangerouslySetInnerHTML={{ __html: safeHtml }}
      />

      {/* Gradient fade overlay */}
      {needsExpand && !expanded && (
        <div
          className="absolute bottom-0 left-0 right-0 h-16 pointer-events-none"
          style={{
            background: 'linear-gradient(transparent, var(--cs-detail-bg))',
          }}
        />
      )}

      {/* Toggle button */}
      {needsExpand && (
        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          className="mt-2 text-sm font-medium hover:underline"
          style={{ color: 'var(--cs-accent)' }}
        >
          {expanded ? 'Sembunyikan' : 'Selengkapnya'}
        </button>
      )}
    </div>
  );
}
