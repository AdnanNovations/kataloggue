import React from 'react';
import type { CatalogStyle } from '../../lib/catalog-style';
import { RADIUS_MAP, SHADOW_MAP } from '../../lib/catalog-style';

interface CatalogPreviewProps {
  style: CatalogStyle;
  storeName: string;
}

const SAMPLE_PRODUCTS = [
  { name: 'Produk Contoh A', price: 'Rp 25.000', category: 'Makanan' },
  { name: 'Produk Contoh B', price: 'Rp 50.000', category: 'Minuman' },
  { name: 'Produk Contoh C', price: 'Rp 15.000', category: 'Makanan' },
];

function StorePreview({ s, storeName, radius, shadow }: { s: CatalogStyle; storeName: string; radius: string; shadow: string }) {
  return (
    <div
      className="rounded-xl overflow-hidden border border-gray-200"
      style={{
        backgroundColor: s.pageBg,
        backgroundImage: s.pageBgImage ? `url(${s.pageBgImage})` : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        position: 'relative',
      }}
    >
      {s.pageBgImage && s.pageBgOverlay > 0 && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: `rgba(0,0,0,${s.pageBgOverlay / 100})`,
            pointerEvents: 'none',
          }}
        />
      )}
      <div style={{ position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <div
          style={{
            backgroundColor: s.headerBg,
            borderBottom: `1px solid ${s.headerBorder}`,
            padding: '12px 16px',
          }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
              style={{ backgroundColor: s.accentLight, color: s.accentColor }}
            >
              {storeName.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="font-bold text-sm" style={{ color: s.headerText }}>
                {storeName || 'Nama Toko'}
              </div>
              <div className="text-xs" style={{ color: s.headerSubtext }}>
                Deskripsi toko anda
              </div>
            </div>
          </div>
        </div>

        {/* Pills */}
        <div className="px-4 pt-3 flex gap-1.5">
          <span
            className="px-2.5 py-1 rounded-full text-[10px] font-medium"
            style={{ backgroundColor: s.pillActiveBg, color: s.pillActiveText }}
          >
            Semua
          </span>
          <span
            className="px-2.5 py-1 rounded-full text-[10px] font-medium"
            style={{ backgroundColor: s.pillBg, color: s.pillText }}
          >
            Makanan
          </span>
          <span
            className="px-2.5 py-1 rounded-full text-[10px] font-medium"
            style={{ backgroundColor: s.pillBg, color: s.pillText }}
          >
            Minuman
          </span>
        </div>

        {/* Products */}
        <div className="p-4 grid grid-cols-3 gap-2">
          {SAMPLE_PRODUCTS.map((p, i) => (
            <div
              key={i}
              style={{
                backgroundColor: s.cardBg,
                borderRadius: radius,
                boxShadow: shadow,
                border: `1px solid ${s.cardBorder}`,
                overflow: 'hidden',
              }}
            >
              <div className="aspect-square bg-gray-200" />
              <div className="p-1.5">
                <div
                  className="text-[9px] uppercase"
                  style={{ color: s.categoryLabelColor }}
                >
                  {p.category}
                </div>
                <div
                  className="text-[10px] font-semibold leading-tight mt-0.5 truncate"
                  style={{ color: s.productNameColor }}
                >
                  {p.name}
                </div>
                <div
                  className="text-[10px] font-bold mt-0.5"
                  style={{ color: s.priceColor }}
                >
                  {p.price}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Review Section */}
        <div className="px-4 pb-3">
          <div
            className="rounded-lg p-3"
            style={{
              backgroundColor: s.reviewBg,
              border: `1px solid ${s.reviewBorder}`,
            }}
          >
            <div className="text-[10px] font-bold mb-2" style={{ color: s.reviewText }}>
              Tulis Ulasan
            </div>
            <div
              className="rounded px-2 py-1.5 text-[9px] mb-1.5"
              style={{ backgroundColor: s.reviewInputBg, color: s.reviewSubtext }}
            >
              Nama Anda
            </div>
            <div className="flex gap-0.5 mb-1.5">
              {[1, 2, 3, 4, 5].map((i) => (
                <svg key={i} className="w-2.5 h-2.5" viewBox="0 0 24 24" fill={i <= 4 ? '#fbbf24' : 'none'} stroke={i <= 4 ? '#fbbf24' : '#d1d5db'} strokeWidth="2">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              ))}
            </div>
            <div
              className="rounded px-2 py-2 text-[9px] mb-2"
              style={{ backgroundColor: s.reviewInputBg, color: s.reviewSubtext }}
            >
              Komentar...
            </div>
            <div
              className="rounded py-1 text-center text-[9px] font-medium text-white"
              style={{ backgroundColor: s.accentColor }}
            >
              Kirim Ulasan
            </div>
          </div>
        </div>

        {/* Footer */}
        <div
          className="text-center py-3 text-[10px]"
          style={{
            backgroundColor: s.footerBg,
            color: s.footerText,
            borderTop: `1px solid ${s.footerBorder}`,
          }}
        >
          &copy; 2026 KatalogGue
        </div>
      </div>
    </div>
  );
}

function ProductDetailPreview({ s, storeName }: { s: CatalogStyle; storeName: string }) {
  return (
    <div
      className="rounded-xl overflow-hidden border border-gray-200"
      style={{
        backgroundColor: s.pageBg,
        backgroundImage: s.pageBgImage ? `url(${s.pageBgImage})` : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        position: 'relative',
      }}
    >
      {s.pageBgImage && s.pageBgOverlay > 0 && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: `rgba(0,0,0,${s.pageBgOverlay / 100})`,
            pointerEvents: 'none',
          }}
        />
      )}
      <div style={{ position: 'relative', zIndex: 1 }}>
        {/* Breadcrumb */}
        <div
          style={{
            backgroundColor: s.headerBg,
            borderBottom: `1px solid ${s.headerBorder}`,
            padding: '8px 16px',
          }}
        >
          <div className="text-[10px] truncate" style={{ color: s.headerSubtext }}>
            <span>{storeName}</span>
            <span className="mx-1">/</span>
            <span style={{ color: s.headerText }}>Produk Contoh A</span>
          </div>
        </div>

        {/* Product detail card */}
        <div className="p-3">
          <div
            className="rounded-lg overflow-hidden"
            style={{
              backgroundColor: s.detailBg,
              border: `1px solid ${s.detailBorder}`,
            }}
          >
            <div className="flex">
              {/* Image */}
              <div
                className="w-24 flex-shrink-0"
                style={{ backgroundColor: s.detailLabelBg }}
              >
                <div className="aspect-square flex items-center justify-center" style={{ color: s.detailSubtext }}>
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>

              {/* Info */}
              <div className="flex-1 p-2.5">
                <div
                  className="text-[9px] uppercase px-1.5 py-0.5 rounded inline-block"
                  style={{ color: s.categoryLabelColor, backgroundColor: s.detailLabelBg }}
                >
                  Makanan
                </div>
                <div className="text-[11px] font-bold mt-1 leading-tight" style={{ color: s.productNameColor }}>
                  Produk Contoh A
                </div>
                <div className="flex items-center gap-0.5 mt-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <svg key={i} className="w-2 h-2" viewBox="0 0 24 24" fill={i <= 4 ? '#fbbf24' : 'none'} stroke={i <= 4 ? '#fbbf24' : '#d1d5db'} strokeWidth="2">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  ))}
                  <span className="text-[8px] ml-0.5" style={{ color: s.detailSubtext }}>4.0 (5)</span>
                </div>
                <div className="text-xs font-bold mt-1.5" style={{ color: s.priceColor }}>
                  Rp 25.000
                </div>

                {/* Description */}
                <div className="mt-2">
                  <div className="text-[9px] font-semibold mb-0.5" style={{ color: s.productNameColor }}>
                    Deskripsi
                  </div>
                  <div className="text-[9px] leading-relaxed" style={{ color: s.detailText }}>
                    Produk berkualitas tinggi dengan bahan pilihan terbaik. Cocok untuk segala acara.
                  </div>
                </div>

                {/* WhatsApp button */}
                <div
                  className="mt-2 rounded text-center py-1.5 text-[9px] font-semibold text-white"
                  style={{ backgroundColor: '#16a34a' }}
                >
                  Order via WhatsApp
                </div>

                {/* Share */}
                <div
                  className="mt-2 pt-2 flex items-center gap-1.5"
                  style={{ borderTop: `1px solid ${s.detailBorder}` }}
                >
                  <span className="text-[8px]" style={{ color: s.detailSubtext }}>Bagikan:</span>
                  <span
                    className="text-[8px] px-1.5 py-0.5 rounded"
                    style={{ backgroundColor: s.detailLabelBg, color: s.detailText }}
                  >
                    Salin Link
                  </span>
                  <span
                    className="text-[8px] px-1.5 py-0.5 rounded"
                    style={{ backgroundColor: s.accentLight, color: s.accentDark }}
                  >
                    WhatsApp
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div
          className="text-center py-2 text-[10px]"
          style={{
            backgroundColor: s.footerBg,
            color: s.footerText,
            borderTop: `1px solid ${s.footerBorder}`,
          }}
        >
          &copy; 2026 KatalogGue
        </div>
      </div>
    </div>
  );
}

export default function CatalogPreview({ style: s, storeName }: CatalogPreviewProps) {
  const radius = RADIUS_MAP[s.cardRadius] || '0.75rem';
  const shadow = SHADOW_MAP[s.cardShadow] || 'none';

  return (
    <div className="space-y-3">
      <div>
        <div className="text-[10px] font-medium text-gray-400 uppercase tracking-wider mb-1.5">Halaman Toko</div>
        <StorePreview s={s} storeName={storeName} radius={radius} shadow={shadow} />
      </div>
      <div>
        <div className="text-[10px] font-medium text-gray-400 uppercase tracking-wider mb-1.5">Halaman Produk</div>
        <ProductDetailPreview s={s} storeName={storeName} />
      </div>
    </div>
  );
}
