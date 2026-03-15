import React, { useState, useRef } from 'react';
import type { CatalogStyle } from '../../lib/catalog-style';
import { DEFAULT_CATALOG_STYLE, CATALOG_PRESETS } from '../../lib/catalog-style';
import ColorInput from './ColorInput';
import ButtonGroup from './ButtonGroup';
import CatalogPreview from './CatalogPreview';

const MAX_BG_SIZE = 600 * 1024; // 600KB

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
  const [bgUploading, setBgUploading] = useState(false);
  const [bgError, setBgError] = useState('');
  const [bgInputMode, setBgInputMode] = useState<'upload' | 'url'>(
    initialStyle.pageBgImage && initialStyle.pageBgImage.startsWith('http') ? 'url' : 'upload',
  );
  const [dragging, setDragging] = useState(false);
  const bgInputRef = useRef<HTMLInputElement>(null);

  const update = (partial: Partial<CatalogStyle>) => {
    setStyle((prev) => ({ ...prev, ...partial }));
  };

  const handleBgUpload = async (file: File) => {
    setBgError('');
    if (!file.type.match(/^image\/(jpeg|png|webp)$/)) {
      setBgError('Format tidak didukung. Gunakan JPG, PNG, atau WebP.');
      return;
    }
    if (file.size > MAX_BG_SIZE) {
      setBgError(`Ukuran file ${(file.size / 1024).toFixed(0)}KB melebihi batas 600KB.`);
      return;
    }
    setBgUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      const data = await res.json();
      if (!res.ok) {
        setBgError(data.error || 'Gagal upload gambar');
        return;
      }
      update({ pageBgImage: data.url });
    } catch {
      setBgError('Gagal upload gambar. Coba lagi.');
    } finally {
      setBgUploading(false);
    }
  };

  const handleBgDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleBgUpload(file);
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

              {/* Background Image */}
              <div>
                <label className="text-xs text-gray-500 block mb-2">Gambar Background</label>

                {/* Mode toggle */}
                <div className="flex gap-1 mb-2 p-0.5 bg-gray-100 rounded-lg">
                  <button
                    type="button"
                    onClick={() => setBgInputMode('upload')}
                    className={`flex-1 text-xs py-1.5 rounded-md font-medium transition-colors ${
                      bgInputMode === 'upload'
                        ? 'bg-white text-gray-800 shadow-sm'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    Upload Gambar
                  </button>
                  <button
                    type="button"
                    onClick={() => setBgInputMode('url')}
                    className={`flex-1 text-xs py-1.5 rounded-md font-medium transition-colors ${
                      bgInputMode === 'url'
                        ? 'bg-white text-gray-800 shadow-sm'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    URL Gambar
                  </button>
                </div>

                {bgInputMode === 'upload' ? (
                  <div>
                    {/* Preview with remove */}
                    {style.pageBgImage && !style.pageBgImage.startsWith('http') && (
                      <div className="relative mb-2 rounded-lg overflow-hidden border border-gray-200">
                        <img
                          src={style.pageBgImage}
                          alt="Background preview"
                          className="w-full h-28 object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => update({ pageBgImage: '', pageBgOverlay: 0 })}
                          className="absolute top-1.5 right-1.5 w-6 h-6 flex items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors"
                          title="Hapus gambar"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    )}

                    {/* Drop zone */}
                    <div
                      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                      onDragLeave={() => setDragging(false)}
                      onDrop={handleBgDrop}
                      onClick={() => bgInputRef.current?.click()}
                      className={`relative border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors ${
                        dragging
                          ? 'border-green-400 bg-green-50'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      {bgUploading ? (
                        <div className="flex items-center justify-center gap-2 py-2">
                          <svg className="w-5 h-5 animate-spin text-green-600" viewBox="0 0 24 24" fill="none">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                          </svg>
                          <span className="text-sm text-gray-600">Mengupload...</span>
                        </div>
                      ) : (
                        <div>
                          <svg className="w-8 h-8 mx-auto text-gray-400 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          <p className="text-xs text-gray-500">Klik atau seret gambar ke sini</p>
                          <p className="text-[10px] text-gray-400 mt-0.5">JPG, PNG, WebP (maks 600KB)</p>
                        </div>
                      )}
                    </div>
                    <input
                      ref={bgInputRef}
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleBgUpload(file);
                        e.target.value = '';
                      }}
                    />
                  </div>
                ) : (
                  <div>
                    {/* URL preview */}
                    {style.pageBgImage && style.pageBgImage.startsWith('http') && (
                      <div className="relative mb-2 rounded-lg overflow-hidden border border-gray-200">
                        <img
                          src={style.pageBgImage}
                          alt="Background preview"
                          className="w-full h-28 object-cover"
                          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                        />
                        <button
                          type="button"
                          onClick={() => update({ pageBgImage: '', pageBgOverlay: 0 })}
                          className="absolute top-1.5 right-1.5 w-6 h-6 flex items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors"
                          title="Hapus gambar"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    )}
                    <input
                      type="text"
                      value={style.pageBgImage}
                      onChange={(e) => update({ pageBgImage: e.target.value })}
                      placeholder="https://example.com/gambar.jpg"
                      className="w-full text-sm border border-gray-200 rounded-lg px-3 py-1.5"
                    />
                  </div>
                )}

                {bgError && (
                  <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1">
                    <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {bgError}
                  </p>
                )}
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
