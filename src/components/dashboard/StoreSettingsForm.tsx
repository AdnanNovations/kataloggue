import { useState } from 'react';
import ImageUpload from './ImageUpload';

interface Store {
  id?: string;
  name: string;
  slug: string;
  description: string;
  wa_number: string;
  address: string;
  logo_url: string;
}

interface Props {
  store?: Store;
}

export default function StoreSettingsForm({ store }: Props) {
  const [form, setForm] = useState<Store>({
    name: store?.name || '',
    slug: store?.slug || '',
    description: store?.description || '',
    wa_number: store?.wa_number || '',
    address: store?.address || '',
    logo_url: store?.logo_url || '',
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

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
