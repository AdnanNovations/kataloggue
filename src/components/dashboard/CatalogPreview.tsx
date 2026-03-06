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

export default function CatalogPreview({ style: s, storeName }: CatalogPreviewProps) {
  const radius = RADIUS_MAP[s.cardRadius] || '0.75rem';
  const shadow = SHADOW_MAP[s.cardShadow] || 'none';

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
