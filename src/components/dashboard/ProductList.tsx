import { useState } from 'react';
import ProductForm from './ProductForm';
import StarRating from '../reviews/StarRating';

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  image_url: string | null;
  category: string | null;
  is_available: boolean;
  avg_rating?: number;
  review_count?: number;
  visitor_count?: number;
}

interface Props {
  initialProducts: Product[];
  storeSlug: string;
}

function formatPrice(price: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(price);
}

export default function ProductList({ initialProducts, storeSlug }: Props) {
  const [products, setProducts] = useState(initialProducts);
  const [editing, setEditing] = useState<Product | null>(null);
  const [showForm, setShowForm] = useState(false);

  async function refresh() {
    // Reload the page to get fresh data from SSR
    window.location.reload();
  }

  async function handleDelete(id: string) {
    if (!confirm('Hapus produk ini?')) return;

    try {
      const res = await fetch('/api/produk', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      const data = await res.json();
      if (data.success) {
        setProducts(prev => prev.filter(p => p.id !== id));
      } else {
        alert(data.error || 'Gagal menghapus produk');
      }
    } catch {
      alert('Gagal menghapus produk');
    }
  }

  if (showForm || editing) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-md">
        <ProductForm
          product={editing ? {
            id: editing.id,
            name: editing.name,
            slug: editing.slug,
            description: editing.description || '',
            price: editing.price,
            image_url: editing.image_url || '',
            category: editing.category || '',
            is_available: editing.is_available,
          } : undefined}
          onSaved={() => {
            setEditing(null);
            setShowForm(false);
            refresh();
          }}
          onCancel={() => {
            setEditing(null);
            setShowForm(false);
          }}
        />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <p className="text-gray-600">{products.length} produk</p>
        <button
          onClick={() => setShowForm(true)}
          className="bg-green-600 text-white px-5 py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors"
        >
          + Tambah Produk
        </button>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl shadow-md">
          <div className="text-4xl mb-3">&#128230;</div>
          <p className="text-gray-500 mb-4">Belum ada produk. Tambahkan produk pertama Anda!</p>
          <button
            onClick={() => setShowForm(true)}
            className="bg-green-600 text-white px-5 py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors"
          >
            + Tambah Produk
          </button>
        </div>
      ) : (
        <div className="grid gap-4">
          {products.map(product => (
            <div key={product.id} className="bg-white rounded-xl shadow-md p-4 flex gap-4 items-center">
              {product.image_url ? (
                <img src={product.image_url} alt={product.name} className="w-20 h-20 object-cover rounded-lg flex-shrink-0" />
              ) : (
                <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 flex-shrink-0">
                  <span className="text-2xl">&#128247;</span>
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-gray-900 truncate">{product.name}</h3>
                  {!product.is_available && (
                    <span className="px-2 py-0.5 text-xs bg-red-100 text-red-800 rounded-full">Habis</span>
                  )}
                </div>
                <p className="text-green-600 font-semibold">{formatPrice(product.price)}</p>
                <div className="flex items-center gap-2 flex-wrap">
                  {product.category && (
                    <span className="flex flex-wrap gap-1">
                      {product.category.split(',').map(cat => cat.trim()).filter(Boolean).map((cat, i) => (
                        <span key={i} className="text-xs text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">{cat}</span>
                      ))}
                    </span>
                  )}
                  {(product.review_count ?? 0) > 0 && (
                    <span className="flex items-center gap-1 text-xs text-gray-500">
                      <StarRating rating={Math.round(product.avg_rating ?? 0)} size="sm" />
                      ({product.review_count})
                    </span>
                  )}
                  {(product.visitor_count ?? 0) > 0 && (
                    <span className="text-xs text-blue-600">
                      {product.visitor_count} pengunjung
                    </span>
                  )}
                </div>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <button
                  onClick={() => setEditing(product)}
                  className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(product.id)}
                  className="px-3 py-1.5 text-sm border border-red-200 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                >
                  Hapus
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {storeSlug && (
        <p className="mt-6 text-sm text-gray-400">
          Lihat katalog publik Anda:{' '}
          <a href={`/${storeSlug}`} className="text-green-600 hover:underline" target="_blank" rel="noopener">
            kataloggue.my.id/{storeSlug}
          </a>
        </p>
      )}
    </div>
  );
}
