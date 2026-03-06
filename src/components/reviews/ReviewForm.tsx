import { useState } from 'react';
import StarRating from './StarRating';

interface Props {
  type: 'store' | 'product';
  targetId: string;
  storeId: string;
  onSubmitted?: () => void;
}

export default function ReviewForm({ type, targetId, storeId, onSubmitted }: Props) {
  const [name, setName] = useState('');
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (!name.trim()) { setError('Nama wajib diisi'); return; }
    if (rating === 0) { setError('Rating wajib dipilih'); return; }

    setLoading(true);
    try {
      const payload: Record<string, any> = {
        reviewer_name: name.trim(),
        rating,
        comment: comment.trim() || null,
      };

      if (type === 'store') {
        payload.store_id = targetId;
      } else {
        payload.product_id = targetId;
        payload.store_id = storeId;
      }

      const res = await fetch(`/api/reviews/${type}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Gagal mengirim ulasan');
        return;
      }

      setSuccess(true);
      setName('');
      setRating(0);
      setComment('');
      onSubmitted?.();
    } catch {
      setError('Gagal mengirim ulasan');
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="rounded-xl p-6 text-center" style={{ background: 'var(--cs-card-bg, #ffffff)', border: '1px solid var(--cs-card-border, #e5e7eb)' }}>
        <div className="text-3xl mb-2">&#10004;&#65039;</div>
        <p className="font-semibold" style={{ color: 'var(--cs-product-name, #111827)' }}>Terima kasih atas ulasan Anda!</p>
        <button
          onClick={() => setSuccess(false)}
          className="mt-3 text-sm underline"
          style={{ color: 'var(--cs-accent, #16a34a)' }}
        >
          Tulis ulasan lagi
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-xl p-5"
      style={{ background: 'var(--cs-card-bg, #ffffff)', border: '1px solid var(--cs-card-border, #e5e7eb)' }}
    >
      <h3 className="font-bold mb-4" style={{ color: 'var(--cs-product-name, #111827)' }}>
        Tulis Ulasan
      </h3>

      {error && (
        <div className="mb-3 px-3 py-2 bg-red-50 text-red-600 text-sm rounded-lg">{error}</div>
      )}

      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium mb-1" style={{ color: 'var(--cs-header-subtext, #6b7280)' }}>
            Nama
          </label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Nama Anda"
            maxLength={100}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1" style={{ color: 'var(--cs-header-subtext, #6b7280)' }}>
            Rating
          </label>
          <StarRating rating={rating} size="lg" interactive onChange={setRating} />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1" style={{ color: 'var(--cs-header-subtext, #6b7280)' }}>
            Komentar <span className="font-normal text-gray-400">(opsional)</span>
          </label>
          <textarea
            value={comment}
            onChange={e => setComment(e.target.value)}
            placeholder="Tulis komentar Anda..."
            maxLength={1000}
            rows={3}
            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 rounded-lg text-sm font-semibold text-white transition-colors disabled:opacity-50"
          style={{ backgroundColor: 'var(--cs-accent, #16a34a)' }}
        >
          {loading ? 'Mengirim...' : 'Kirim Ulasan'}
        </button>
      </div>
    </form>
  );
}
