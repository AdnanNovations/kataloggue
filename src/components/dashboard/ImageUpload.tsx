import { useState, useRef } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
const supabaseKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;

interface Props {
  currentUrl?: string;
  onUploaded: (url: string) => void;
}

export default function ImageUpload({ currentUrl, onUploaded }: Props) {
  const [preview, setPreview] = useState(currentUrl || '');
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      alert('Ukuran file maksimal 2MB');
      return;
    }

    setPreview(URL.createObjectURL(file));
    setUploading(true);

    try {
      // Upload directly to Supabase Storage from browser
      const supabase = createClient(supabaseUrl, supabaseKey);

      // Restore session from localStorage (set during login)
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        alert('Sesi login habis. Silakan login ulang.');
        window.location.href = '/masuk';
        return;
      }

      const ext = file.name.split('.').pop();
      const fileName = `${session.user.id}/${Date.now()}.${ext}`;

      const { error } = await supabase.storage
        .from('images')
        .upload(fileName, file, { contentType: file.type });

      if (error) {
        alert(error.message);
        return;
      }

      const { data: urlData } = supabase.storage.from('images').getPublicUrl(fileName);
      onUploaded(urlData.publicUrl);
    } catch {
      alert('Gagal upload gambar');
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">Foto</label>
      <div
        onClick={() => inputRef.current?.click()}
        className="relative w-full h-48 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-green-500 transition-colors overflow-hidden"
      >
        {preview ? (
          <img src={preview} alt="Preview" className="w-full h-full object-cover" />
        ) : (
          <div className="text-center text-gray-400">
            <div className="text-3xl mb-1">+</div>
            <div className="text-sm">Klik untuk upload foto</div>
            <div className="text-xs">JPG, PNG, WebP (maks 2MB)</div>
          </div>
        )}
        {uploading && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <div className="text-white text-sm">Mengupload...</div>
          </div>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFile}
        className="hidden"
      />
    </div>
  );
}
