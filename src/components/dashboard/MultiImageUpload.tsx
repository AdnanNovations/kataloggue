import { useState, useRef } from 'react';

interface Props {
  images: string[];
  onChange: (images: string[]) => void;
  max?: number;
}

export default function MultiImageUpload({ images, onChange, max = 5 }: Props) {
  const [uploading, setUploading] = useState<number | null>(null);
  const [dragIdx, setDragIdx] = useState<number | null>(null);
  const [dragOver, setDragOver] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      alert('Ukuran file maksimal 2MB');
      return;
    }

    const idx = images.length;
    setUploading(idx);

    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error || 'Gagal upload gambar');
        return;
      }
      onChange([...images, data.url]);
    } catch {
      alert('Gagal upload gambar');
    } finally {
      setUploading(null);
      if (inputRef.current) inputRef.current.value = '';
    }
  }

  function removeImage(idx: number) {
    onChange(images.filter((_, i) => i !== idx));
  }

  function handleDragStart(idx: number) {
    setDragIdx(idx);
  }

  function handleDragOver(e: React.DragEvent, idx: number) {
    e.preventDefault();
    setDragOver(idx);
  }

  function handleDrop(idx: number) {
    if (dragIdx === null || dragIdx === idx) {
      setDragIdx(null);
      setDragOver(null);
      return;
    }
    const reordered = [...images];
    const [moved] = reordered.splice(dragIdx, 1);
    reordered.splice(idx, 0, moved);
    onChange(reordered);
    setDragIdx(null);
    setDragOver(null);
  }

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">Foto Produk</label>
      <div className="flex gap-2 overflow-x-auto pb-2">
        {images.map((url, idx) => (
          <div
            key={url + idx}
            draggable
            onDragStart={() => handleDragStart(idx)}
            onDragOver={(e) => handleDragOver(e, idx)}
            onDragLeave={() => setDragOver(null)}
            onDrop={() => handleDrop(idx)}
            className={`relative w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden border-2 cursor-grab active:cursor-grabbing ${
              dragOver === idx ? 'border-green-500' : 'border-gray-200'
            }`}
          >
            <img src={url} alt={`Foto ${idx + 1}`} className="w-full h-full object-cover" />
            {idx === 0 && (
              <span className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-[10px] text-center py-0.5">
                Utama
              </span>
            )}
            <button
              type="button"
              onClick={() => removeImage(idx)}
              className="absolute top-1 right-1 w-5 h-5 bg-black/60 text-white rounded-full text-xs flex items-center justify-center hover:bg-red-600"
            >
              &times;
            </button>
          </div>
        ))}

        {images.length < max && (
          <div
            onClick={() => inputRef.current?.click()}
            className="relative w-24 h-24 flex-shrink-0 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-green-500 transition-colors"
          >
            {uploading !== null ? (
              <div className="text-xs text-gray-500">Upload...</div>
            ) : (
              <>
                <div className="text-2xl text-gray-400">+</div>
                <div className="text-[10px] text-gray-400">{images.length}/{max}</div>
              </>
            )}
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
      <p className="text-xs text-gray-400">Seret untuk mengatur urutan. Foto pertama = foto utama.</p>
    </div>
  );
}
