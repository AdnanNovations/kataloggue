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
      <div
        className="rounded-xl sm:rounded-2xl p-6 sm:p-8 text-center"
        style={{
          background: 'var(--cs-review-bg, #dcfce7)',
          border: '1px solid var(--cs-review-border, #bbf7d0)',
        }}
      >
        <div className="text-4xl sm:text-5xl mb-3">&#10004;&#65039;</div>
        <p className="font-semibold text-base sm:text-lg" style={{ color: 'var(--cs-review-text, #111827)' }}>
          Terima kasih atas ulasan Anda!
        </p>
        <button
          onClick={() => setSuccess(false)}
          className="mt-3 text-sm sm:text-base font-medium underline underline-offset-2"
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
      className="rounded-xl sm:rounded-2xl p-4 sm:p-6"
      style={{
        background: 'var(--cs-review-bg, #dcfce7)',
        border: '1px solid var(--cs-review-border, #bbf7d0)',
      }}
    >
      <h3 className="font-bold text-base sm:text-lg mb-3 sm:mb-4" style={{ color: 'var(--cs-review-text, #111827)' }}>
        Tulis Ulasan
      </h3>

      {error && (
        <div className="mb-3 px-3 py-2.5 bg-red-50 text-red-600 text-sm rounded-lg">{error}</div>
      )}

      <div className="space-y-3 sm:space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--cs-review-subtext, #6b7280)' }}>
            Nama
          </label>
          <input
            type="text"
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Nama Anda"
            maxLength={100}
            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl text-sm sm:text-base focus:outline-none focus:ring-2 focus:border-transparent"
            style={{
              backgroundColor: 'var(--cs-review-input-bg, #ffffff)',
              color: 'var(--cs-review-text, #111827)',
              border: '1px solid var(--cs-review-border, #bbf7d0)',
              '--tw-ring-color': 'var(--cs-accent, #16a34a)',
            } as React.CSSProperties}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--cs-review-subtext, #6b7280)' }}>
            Rating
          </label>
          <StarRating rating={rating} size="lg" interactive onChange={setRating} />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--cs-review-subtext, #6b7280)' }}>
            Komentar <span className="font-normal opacity-60">(opsional)</span>
          </label>
          <textarea
            value={comment}
            onChange={e => setComment(e.target.value)}
            placeholder="Tulis komentar Anda..."
            maxLength={1000}
            rows={3}
            className="w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl text-sm sm:text-base resize-none focus:outline-none focus:ring-2 focus:border-transparent"
            style={{
              backgroundColor: 'var(--cs-review-input-bg, #ffffff)',
              color: 'var(--cs-review-text, #111827)',
              border: '1px solid var(--cs-review-border, #bbf7d0)',
              '--tw-ring-color': 'var(--cs-accent, #16a34a)',
            } as React.CSSProperties}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 sm:py-3.5 rounded-lg sm:rounded-xl text-sm sm:text-base font-semibold text-white transition-all disabled:opacity-50 hover:opacity-90 active:scale-[0.98]"
          style={{ backgroundColor: 'var(--cs-accent, #16a34a)' }}
        >
          {loading ? 'Mengirim...' : 'Kirim Ulasan'}
        </button>
      </div>
    </form>
  );
}
