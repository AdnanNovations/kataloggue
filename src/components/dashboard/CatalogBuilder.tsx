import React, { useState } from 'react';
import type { CatalogStyle } from '../../lib/catalog-style';
import { DEFAULT_CATALOG_STYLE, CATALOG_PRESETS } from '../../lib/catalog-style';
import ColorInput from './ColorInput';
import ButtonGroup from './ButtonGroup';
import CatalogPreview from './CatalogPreview';

interface CatalogBuilderProps {
  initialStyle: CatalogStyle;
  storeName: string;
  storeSlug: string;
}

type Section = 'background' | 'header' | 'accent' | 'card' | 'pill' | 'review' | 'footer';

export default function CatalogBuilder({ initialStyle, storeName, storeSlug }: CatalogBuilderProps) {
  const [style, setStyle] = useState<CatalogStyle>(initialStyle);
  const [openSections, setOpenSections] = useState<Set<Section>>(new Set(['background']));
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const update = (partial: Partial<CatalogStyle>) => {
    setStyle((prev) => ({ ...prev, ...partial }));
  };

  const toggleSection = (section: Section) => {
    setOpenSections((prev) => {
      const next = new Set(prev);
      if (next.has(section)) next.delete(section);
      else next.add(section);
      return next;
    });
  };

  const applyPreset = (preset: CatalogStyle) => {
    setStyle({ ...preset });
  };

  const save = async () => {
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch('/api/catalog-style', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(style),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage({ type: 'success', text: 'Tampilan berhasil disimpan!' });
      } else {
        setMessage({ type: 'error', text: data.error || 'Gagal menyimpan' });
      }
    } catch {
      setMessage({ type: 'error', text: 'Gagal menyimpan. Coba lagi.' });
    } finally {
      setSaving(false);
    }
  };

  const SectionHeader = ({ id, title }: { id: Section; title: string }) => (
    <button
      type="button"
      onClick={() => toggleSection(id)}
      className="w-full flex items-center justify-between py-3 px-1 text-sm font-semibold text-gray-700 hover:text-gray-900 border-b border-gray-100"
    >
      {title}
      <svg
        className={`w-4 h-4 transition-transform ${openSections.has(id) ? 'rotate-180' : ''}`}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    </button>
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Left: Controls */}
      <div className="space-y-1">
        {/* Preset Templates */}
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Template Preset</h3>
          <div className="grid grid-cols-4 gap-2">
            {CATALOG_PRESETS.map((preset) => (
              <button
                key={preset.id}
                type="button"
                onClick={() => applyPreset(preset.style)}
                className="flex flex-col items-center gap-1.5 p-2 rounded-lg border border-gray-200 hover:border-gray-400 transition-colors"
                title={preset.name}
              >
                <div
                  className="w-8 h-8 rounded-full border-2 border-white shadow-sm"
                  style={{ backgroundColor: preset.color }}
                />
                <span className="text-[10px] text-gray-600 text-center leading-tight">
                  {preset.name}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Collapsible Sections */}
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          {/* Background */}
          <SectionHeader id="background" title="Background" />
          {openSections.has('background') && (
            <div className="py-3 space-y-3">
              <ColorInput label="Warna Background" value={style.pageBg} onChange={(v) => update({ pageBg: v })} />
              <div>
                <label className="text-xs text-gray-500 block mb-1">URL Gambar Background</label>
                <input
                  type="text"
                  value={style.pageBgImage}
                  onChange={(e) => update({ pageBgImage: e.target.value })}
                  placeholder="https://..."
                  className="w-full text-sm border border-gray-200 rounded-lg px-3 py-1.5"
                />
              </div>
              {style.pageBgImage && (
                <div>
                  <label className="text-xs text-gray-500 block mb-1">
                    Overlay Gelap ({style.pageBgOverlay}%)
                  </label>
                  <input
                    type="range"
                    min={0}
                    max={80}
                    value={style.pageBgOverlay}
                    onChange={(e) => update({ pageBgOverlay: Number(e.target.value) })}
                    className="w-full"
                  />
                </div>
              )}
            </div>
          )}

          {/* Header */}
          <SectionHeader id="header" title="Header" />
          {openSections.has('header') && (
            <div className="py-3 space-y-3">
              <ColorInput label="Background Header" value={style.headerBg} onChange={(v) => update({ headerBg: v })} />
              <ColorInput label="Border Header" value={style.headerBorder} onChange={(v) => update({ headerBorder: v })} />
              <ColorInput label="Nama Toko" value={style.headerText} onChange={(v) => update({ headerText: v })} />
              <ColorInput label="Deskripsi/Meta" value={style.headerSubtext} onChange={(v) => update({ headerSubtext: v })} />
            </div>
          )}

          {/* Accent Colors */}
          <SectionHeader id="accent" title="Warna Aksen" />
          {openSections.has('accent') && (
            <div className="py-3 space-y-3">
              <ColorInput label="Warna Utama" value={style.accentColor} onChange={(v) => update({ accentColor: v })} />
              <ColorInput label="Warna Hover" value={style.accentDark} onChange={(v) => update({ accentDark: v })} />
              <ColorInput label="Warna Terang" value={style.accentLight} onChange={(v) => update({ accentLight: v })} />
            </div>
          )}

          {/* Card */}
          <SectionHeader id="card" title="Kartu Produk" />
          {openSections.has('card') && (
            <div className="py-3 space-y-3">
              <ColorInput label="Background Kartu" value={style.cardBg} onChange={(v) => update({ cardBg: v })} />
              <ColorInput label="Border Kartu" value={style.cardBorder} onChange={(v) => update({ cardBorder: v })} />
              <ButtonGroup
                label="Radius"
                value={style.cardRadius}
                options={[
                  { value: 'none', label: 'Tidak' },
                  { value: 'sm', label: 'Kecil' },
                  { value: 'md', label: 'Sedang' },
                  { value: 'lg', label: 'Besar' },
                  { value: 'xl', label: 'XL' },
                ]}
                onChange={(v) => update({ cardRadius: v as CatalogStyle['cardRadius'] })}
              />
              <ButtonGroup
                label="Bayangan"
                value={style.cardShadow}
                options={[
                  { value: 'none', label: 'Tidak' },
                  { value: 'sm', label: 'Kecil' },
                  { value: 'md', label: 'Sedang' },
                  { value: 'lg', label: 'Besar' },
                ]}
                onChange={(v) => update({ cardShadow: v as CatalogStyle['cardShadow'] })}
              />
              <ColorInput label="Nama Produk" value={style.productNameColor} onChange={(v) => update({ productNameColor: v })} />
              <ColorInput label="Label Kategori" value={style.categoryLabelColor} onChange={(v) => update({ categoryLabelColor: v })} />
              <ColorInput label="Harga" value={style.priceColor} onChange={(v) => update({ priceColor: v })} />
            </div>
          )}

          {/* Pills */}
          <SectionHeader id="pill" title="Pil Kategori" />
          {openSections.has('pill') && (
            <div className="py-3 space-y-3">
              <ColorInput label="Pil Aktif - Background" value={style.pillActiveBg} onChange={(v) => update({ pillActiveBg: v })} />
              <ColorInput label="Pil Aktif - Teks" value={style.pillActiveText} onChange={(v) => update({ pillActiveText: v })} />
              <ColorInput label="Pil Biasa - Background" value={style.pillBg} onChange={(v) => update({ pillBg: v })} />
              <ColorInput label="Pil Biasa - Teks" value={style.pillText} onChange={(v) => update({ pillText: v })} />
            </div>
          )}

          {/* Review */}
          <SectionHeader id="review" title="Ulasan" />
          {openSections.has('review') && (
            <div className="py-3 space-y-3">
              <ColorInput label="Background Ulasan" value={style.reviewBg} onChange={(v) => update({ reviewBg: v })} />
              <ColorInput label="Border Ulasan" value={style.reviewBorder} onChange={(v) => update({ reviewBorder: v })} />
              <ColorInput label="Teks Ulasan" value={style.reviewText} onChange={(v) => update({ reviewText: v })} />
              <ColorInput label="Teks Sekunder" value={style.reviewSubtext} onChange={(v) => update({ reviewSubtext: v })} />
              <ColorInput label="Background Input" value={style.reviewInputBg} onChange={(v) => update({ reviewInputBg: v })} />
            </div>
          )}

          {/* Footer */}
          <SectionHeader id="footer" title="Footer" />
          {openSections.has('footer') && (
            <div className="py-3 space-y-3">
              <ColorInput label="Background Footer" value={style.footerBg} onChange={(v) => update({ footerBg: v })} />
              <ColorInput label="Teks Footer" value={style.footerText} onChange={(v) => update({ footerText: v })} />
              <ColorInput label="Border Footer" value={style.footerBorder} onChange={(v) => update({ footerBorder: v })} />
            </div>
          )}
        </div>

        {/* Save button */}
        <div className="pt-2">
          {message && (
            <div
              className={`mb-3 p-3 rounded-lg text-sm ${
                message.type === 'success'
                  ? 'bg-green-50 text-green-700 border border-green-200'
                  : 'bg-red-50 text-red-700 border border-red-200'
              }`}
            >
              {message.text}
            </div>
          )}
          <button
            type="button"
            onClick={save}
            disabled={saving}
            className="w-full py-2.5 px-4 bg-primary text-white font-medium rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50"
          >
            {saving ? 'Menyimpan...' : 'Simpan Tampilan'}
          </button>
        </div>
      </div>

      {/* Right: Preview */}
      <div className="lg:sticky lg:top-20 lg:self-start space-y-3">
        <h3 className="text-sm font-semibold text-gray-700">Pratinjau</h3>
        <CatalogPreview style={style} storeName={storeName} />
        <a
          href={`/${storeSlug}`}
          target="_blank"
          rel="noopener"
          className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
        >
          Buka katalog publik &rarr;
        </a>
      </div>
    </div>
  );
}
