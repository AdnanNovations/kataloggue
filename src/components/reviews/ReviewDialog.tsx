import { useState, useRef, useEffect } from 'react';
import StarRating from './StarRating';

interface Review {
  id: string;
  reviewer_name: string;
  rating: number;
  comment: string | null;
  created_at: string;
  product_name?: string;
}

interface Props {
  type: 'store' | 'product';
  targetId: string;
  avgRating: number;
  totalReviews: number;
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return 'baru saja';
  if (minutes < 60) return `${minutes} menit lalu`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} jam lalu`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days} hari lalu`;
  const months = Math.floor(days / 30);
  return `${months} bulan lalu`;
}

export default function ReviewDialog({ type, targetId, avgRating, totalReviews }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(totalReviews);
  const limit = 10;

  async function fetchReviews(p: number, append = false) {
    setLoading(true);
    try {
      const param = type === 'store' ? 'store_id' : 'product_id';
      const res = await fetch(`/api/reviews/${type}?${param}=${targetId}&page=${p}&limit=${limit}`);
      const data = await res.json();
      setReviews(prev => append ? [...prev, ...data.reviews] : data.reviews);
      setTotal(data.total);
      setPage(p);
    } finally {
      setLoading(false);
    }
  }

  function open() {
    dialogRef.current?.showModal();
    if (reviews.length === 0) fetchReviews(1);
  }

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    function handleClick(e: MouseEvent) {
      if (e.target === dialog) dialog.close();
    }
    dialog.addEventListener('click', handleClick);
    return () => dialog.removeEventListener('click', handleClick);
  }, []);

  if (totalReviews === 0 && total === 0) return null;

  return (
    <>
      <button
        onClick={open}
        className="inline-flex items-center gap-1.5 text-sm hover:underline"
        style={{ color: 'var(--cs-accent, #16a34a)' }}
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="#fbbf24" stroke="#fbbf24" strokeWidth="2">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
        {avgRating > 0 ? avgRating.toFixed(1) : '0'} ({total} ulasan)
      </button>

      <dialog
        ref={dialogRef}
        className="w-full max-w-lg rounded-xl shadow-2xl p-0 backdrop:bg-black/50"
      >
        <div className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">Ulasan</h2>
            <button
              onClick={() => dialogRef.current?.close()}
              className="text-gray-400 hover:text-gray-600 text-xl leading-none"
            >
              &times;
            </button>
          </div>

          {avgRating > 0 && (
            <div className="flex items-center gap-2 mb-4 pb-4 border-b border-gray-100">
              <span className="text-2xl font-bold text-gray-900">{avgRating.toFixed(1)}</span>
              <StarRating rating={Math.round(avgRating)} size="md" />
              <span className="text-sm text-gray-500">({total} ulasan)</span>
            </div>
          )}

          <div className="space-y-4 max-h-96 overflow-y-auto">
            {reviews.map(review => (
              <div key={review.id} className="border-b border-gray-50 pb-3 last:border-0">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-sm text-gray-900">{review.reviewer_name}</span>
                  <span className="text-xs text-gray-400">{timeAgo(review.created_at)}</span>
                </div>
                <div className="mt-1">
                  <StarRating rating={review.rating} size="sm" />
                </div>
                {review.comment && (
                  <p className="mt-1 text-sm text-gray-600">{review.comment}</p>
                )}
              </div>
            ))}

            {loading && (
              <p className="text-center text-sm text-gray-400 py-2">Memuat...</p>
            )}

            {!loading && reviews.length === 0 && (
              <p className="text-center text-sm text-gray-400 py-4">Belum ada ulasan</p>
            )}
          </div>

          {reviews.length < total && !loading && (
            <button
              onClick={() => fetchReviews(page + 1, true)}
              className="w-full mt-4 py-2 text-sm font-medium rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Muat lebih banyak
            </button>
          )}
        </div>
      </dialog>
    </>
  );
}
