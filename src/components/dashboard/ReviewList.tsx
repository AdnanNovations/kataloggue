import { useState } from 'react';
import StarRating from '../reviews/StarRating';

interface Review {
  id: string;
  reviewer_name: string;
  rating: number;
  comment: string | null;
  created_at: string;
  product_name?: string;
}

interface Stats {
  storeCount: number;
  storeAvg: number;
  productCount: number;
  productAvg: number;
}

interface Props {
  storeReviews: Review[];
  productReviews: Review[];
  stats: Stats;
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export default function ReviewList({ storeReviews, productReviews, stats }: Props) {
  const [tab, setTab] = useState<'store' | 'product'>('store');

  const reviews = tab === 'store' ? storeReviews : productReviews;
  const count = tab === 'store' ? stats.storeCount : stats.productCount;
  const avg = tab === 'store' ? stats.storeAvg : stats.productAvg;

  return (
    <div>
      {/* Stats summary */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow-md p-4">
          <div className="text-sm text-gray-500">Ulasan Toko</div>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold">{stats.storeCount}</span>
            {stats.storeAvg > 0 && (
              <span className="text-sm text-amber-500 flex items-center gap-0.5">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="#fbbf24" stroke="#fbbf24" strokeWidth="2">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
                {stats.storeAvg.toFixed(1)}
              </span>
            )}
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-md p-4">
          <div className="text-sm text-gray-500">Ulasan Produk</div>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold">{stats.productCount}</span>
            {stats.productAvg > 0 && (
              <span className="text-sm text-amber-500 flex items-center gap-0.5">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="#fbbf24" stroke="#fbbf24" strokeWidth="2">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
                {stats.productAvg.toFixed(1)}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setTab('store')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            tab === 'store'
              ? 'bg-green-600 text-white'
              : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
          }`}
        >
          Ulasan Toko ({stats.storeCount})
        </button>
        <button
          onClick={() => setTab('product')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            tab === 'product'
              ? 'bg-green-600 text-white'
              : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
          }`}
        >
          Ulasan Produk ({stats.productCount})
        </button>
      </div>

      {/* Review list */}
      {reviews.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl shadow-md">
          <div className="text-4xl mb-3">&#11088;</div>
          <p className="text-gray-500">Belum ada ulasan {tab === 'store' ? 'toko' : 'produk'}</p>
        </div>
      ) : (
        <div className="grid gap-3">
          {reviews.map(review => (
            <div key={review.id} className="bg-white rounded-xl shadow-md p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-gray-900">{review.reviewer_name}</span>
                    {review.product_name && (
                      <span className="px-2 py-0.5 text-xs bg-blue-50 text-blue-700 rounded-full">
                        {review.product_name}
                      </span>
                    )}
                  </div>
                  <div className="mt-1">
                    <StarRating rating={review.rating} size="sm" />
                  </div>
                  {review.comment && (
                    <p className="mt-2 text-sm text-gray-600">{review.comment}</p>
                  )}
                </div>
                <span className="text-xs text-gray-400 flex-shrink-0">{formatDate(review.created_at)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
