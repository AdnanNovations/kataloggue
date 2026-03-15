import { useState } from 'react';
import MultiImageUpload from './MultiImageUpload';
import VariantEditor from './VariantEditor';
import type { VariantGroup } from '../../lib/db';

interface Product {
  id?: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  image_url: string;
  images: string[];
  variants: VariantGroup[];
  category: string;
  is_available: boolean;
}

interface Props {
  product?: Product;
  onSaved: () => void;
  onCancel: () => void;
}

export default function ProductForm({ product, onSaved, onCancel }: Props) {
  const [form, setForm] = useState<Product>({
    id: product?.id,
    name: product?.name || '',
    slug: product?.slug || '',
    description: product?.description || '',
    price: product?.price || 0,
    image_url: product?.image_url || '',
    images: product?.images || [],
    variants: product?.variants || [],
    category: product?.category || '',
    is_available: product?.is_available ?? true,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  function updateName(value: string) {
    setForm(prev => ({
      ...prev,
      name: value,
      slug: !product?.id
        ? value.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-')
        : prev.slug,
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      const payload = {
        ...form,
        image_url: form.images.length > 0 ? form.images[0] : form.image_url,
      };
      const res = await fetch('/api/produk', {
        method: product?.id ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.error) {
        setError(data.error);
      } else {
        onSaved();
      }
    } catch {
      setError('Gagal menyimpan produk');
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h3 className="text-lg font-semibold">
        {product?.id ? 'Edit Produk' : 'Tambah Produk Baru'}
      </h3>

      {error && (
        <div className="p-3 bg-red-50 text-red-700 rounded-lg text-sm">{error}</div>
      )}

      <MultiImageUpload
        images={form.images}
        onChange={(images) => setForm(prev => ({ ...prev, images }))}
      />

      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700">Nama Produk *</label>
        <input
          type="text"
          required
          value={form.name}
          onChange={e => updateName(e.target.value)}
          placeholder="Contoh: Kue Lapis Legit"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent outline-none"
        />
      </div>

      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700">Harga (Rp) *</label>
        <input
          type="number"
          required
          min="0"
          value={form.price || ''}
          onChange={e => setForm(prev => ({ ...prev, price: parseInt(e.target.value) || 0 }))}
          placeholder="50000"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent outline-none"
        />
      </div>

      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700">Kategori</label>
        <input
          type="text"
          value={form.category}
          onChange={e => setForm(prev => ({ ...prev, category: e.target.value }))}
          placeholder="Contoh: Kue, Makanan, Minuman"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent outline-none"
        />
      </div>

      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700">Deskripsi</label>
        <textarea
          value={form.description}
          onChange={e => setForm(prev => ({ ...prev, description: e.target.value }))}
          rows={3}
          placeholder="Jelaskan produk Anda..."
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent outline-none"
        />
      </div>

      <VariantEditor
        variants={form.variants}
        onChange={(variants) => setForm(prev => ({ ...prev, variants }))}
      />

      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={form.is_available}
          onChange={e => setForm(prev => ({ ...prev, is_available: e.target.checked }))}
          className="rounded"
        />
        <span className="text-sm text-gray-700">Produk tersedia</span>
      </label>

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={saving}
          className="bg-green-600 text-white px-5 py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50"
        >
          {saving ? 'Menyimpan...' : 'Simpan'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-5 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Batal
        </button>
      </div>
    </form>
  );
}
