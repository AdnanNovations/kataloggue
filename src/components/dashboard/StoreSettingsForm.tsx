import { useState } from 'react';
import ImageUpload from './ImageUpload';
import { THEME_PRESETS } from '../../lib/theme';

interface Store {
  id?: string;
  name: string;
  slug: string;
  description: string;
  wa_number: string;
  address: string;
  logo_url: string;
  theme: string;
}

interface Props {
  store?: Store;
}

const PRESET_LABELS: Record<string, string> = {
  default: 'Hijau',
  blue: 'Biru',
  red: 'Merah',
  purple: 'Ungu',
  orange: 'Oranye',
  pink: 'Pink',
  teal: 'Teal',
  slate: 'Abu',
};

export default function StoreSettingsForm({ store }: Props) {
  const initialTheme = store?.theme || 'default';
  const isCustom = initialTheme.startsWith('#');

  const [form, setForm] = useState<Store>({
    name: store?.name || '',
    slug: store?.slug || '',
    description: store?.description || '',
    wa_number: store?.wa_number || '',
    address: store?.address || '',
    logo_url: store?.logo_url || '',
    theme: initialTheme,
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [useCustomColor, setUseCustomColor] = useState(isCustom);
  const [customHex, setCustomHex] = useState(isCustom ? initialTheme : '#');

  function updateField(field: keyof Store, value: string) {
    setForm(prev => ({ ...prev, [field]: value }));
    if (field === 'name' && !store?.id) {
      setForm(prev => ({
        ...prev,
        [field]: value,
        slug: value.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-'),
      }));
    }
  }

  function selectPreset(key: string) {
    setUseCustomColor(false);
    setForm(prev => ({ ...prev, theme: key }));
  }

  function handleCustomToggle() {
    setUseCustomColor(true);
    const hex = customHex.length >= 4 ? customHex : '#000000';
    setForm(prev => ({ ...prev, theme: hex }));
  }

  function handleCustomHexChange(value: string) {
    let hex = value;
    if (!hex.startsWith('#')) hex = '#' + hex;
    hex = '#' + hex.slice(1).replace(/[^0-9a-fA-F]/g, '').slice(0, 6);
    setCustomHex(hex);
    if (/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(hex)) {
      setForm(prev => ({ ...prev, theme: hex }));
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage('');

    try {
      const res = await fetch('/api/toko', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.error) {
        setMessage(`Error: ${data.error}`);
      } else {
        setMessage('Pengaturan berhasil disimpan!');
      }
    } catch {
      setMessage('Gagal menyimpan pengaturan');
    } finally {
      setSaving(false);
    }
  }

  const currentColor = useCustomColor
    ? (customHex.length >= 4 ? customHex : '#000000')
    : THEME_PRESETS[form.theme]?.primary || THEME_PRESETS.default.primary;

  return (
    <form onSubmit={handleSubmit} className="max-w-xl space-y-5">
      {message && (
        <div className={`p-3 rounded-lg text-sm ${message.startsWith('Error') ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
          {message}
        </div>
      )}

      <ImageUpload
        currentUrl={form.logo_url}
        onUploaded={(url) => setForm(prev => ({ ...prev, logo_url: url }))}
      />

      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700">Nama Toko *</label>
        <input
          type="text"
          required
          value={form.name}
          onChange={e => updateField('name', e.target.value)}
          placeholder="Contoh: Kue Lezat Bu Sari"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent outline-none"
        />
      </div>

      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700">Slug URL *</label>
        <div className="flex items-center gap-1 text-sm text-gray-500">
          <span>kataloggue.my.id/</span>
          <input
            type="text"
            required
            value={form.slug}
            onChange={e => updateField('slug', e.target.value)}
            pattern="[a-z0-9-]+"
            placeholder="nama-toko"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent outline-none"
          />
        </div>
      </div>

      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700">Nomor WhatsApp *</label>
        <input
          type="tel"
          required
          value={form.wa_number}
          onChange={e => updateField('wa_number', e.target.value)}
          placeholder="08123456789"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent outline-none"
        />
      </div>

      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700">Deskripsi Toko</label>
        <textarea
          value={form.description}
          onChange={e => updateField('description', e.target.value)}
          rows={3}
          placeholder="Ceritakan tentang toko Anda..."
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent outline-none"
        />
      </div>

      <div className="space-y-1">
        <label className="block text-sm font-medium text-gray-700">Alamat</label>
        <input
          type="text"
          value={form.address}
          onChange={e => updateField('address', e.target.value)}
          placeholder="Kota / Kecamatan"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent outline-none"
        />
      </div>

      {/* Theme Picker */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-700">Warna Tema Katalog</label>
        <div className="flex flex-wrap gap-3">
          {Object.entries(THEME_PRESETS).map(([key, colors]) => (
            <button
              key={key}
              type="button"
              onClick={() => selectPreset(key)}
              title={PRESET_LABELS[key]}
              className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all ${
                !useCustomColor && form.theme === key
                  ? 'border-gray-900 scale-110'
                  : 'border-transparent hover:scale-105'
              }`}
              style={{ backgroundColor: colors.primary }}
            >
              {!useCustomColor && form.theme === key && (
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </button>
          ))}

          {/* Custom color button */}
          <button
            type="button"
            onClick={handleCustomToggle}
            title="Warna kustom"
            className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all bg-gradient-to-br from-red-400 via-blue-400 to-green-400 ${
              useCustomColor
                ? 'border-gray-900 scale-110'
                : 'border-transparent hover:scale-105'
            }`}
          >
            {useCustomColor && (
              <svg className="w-5 h-5 text-white drop-shadow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            )}
          </button>
        </div>

        {/* Custom hex input */}
        {useCustomColor && (
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-lg border border-gray-200 flex-shrink-0"
              style={{ backgroundColor: currentColor }}
            />
            <input
              type="text"
              value={customHex}
              onChange={e => handleCustomHexChange(e.target.value)}
              placeholder="#FF5733"
              maxLength={7}
              className="w-32 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent outline-none font-mono text-sm"
            />
            <span className="text-xs text-gray-400">Contoh: #FF5733</span>
          </div>
        )}

        {/* Preview */}
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <span>Preview:</span>
          <span
            className="px-3 py-1 rounded-full text-white text-xs font-medium"
            style={{ backgroundColor: currentColor }}
          >
            {PRESET_LABELS[form.theme] || 'Kustom'}
          </span>
        </div>
      </div>

      <button
        type="submit"
        disabled={saving}
        className="bg-green-600 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50"
      >
        {saving ? 'Menyimpan...' : 'Simpan Pengaturan'}
      </button>
    </form>
  );
}
