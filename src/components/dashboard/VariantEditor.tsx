import type { VariantGroup, VariantOption } from '../../lib/db';

interface Props {
  variants: VariantGroup[];
  onChange: (variants: VariantGroup[]) => void;
}

export default function VariantEditor({ variants, onChange }: Props) {
  function addGroup() {
    if (variants.length >= 10) return;
    onChange([...variants, { label: '', options: [{ name: '', priceAdjust: 0 }] }]);
  }

  function removeGroup(idx: number) {
    onChange(variants.filter((_, i) => i !== idx));
  }

  function updateGroupLabel(idx: number, label: string) {
    const updated = [...variants];
    updated[idx] = { ...updated[idx], label };
    onChange(updated);
  }

  function addOption(groupIdx: number) {
    if (variants[groupIdx].options.length >= 20) return;
    const updated = [...variants];
    updated[groupIdx] = {
      ...updated[groupIdx],
      options: [...updated[groupIdx].options, { name: '', priceAdjust: 0 }],
    };
    onChange(updated);
  }

  function removeOption(groupIdx: number, optIdx: number) {
    const updated = [...variants];
    updated[groupIdx] = {
      ...updated[groupIdx],
      options: updated[groupIdx].options.filter((_, i) => i !== optIdx),
    };
    if (updated[groupIdx].options.length === 0) {
      onChange(updated.filter((_, i) => i !== groupIdx));
    } else {
      onChange(updated);
    }
  }

  function updateOption(groupIdx: number, optIdx: number, field: keyof VariantOption, value: string | number) {
    const updated = [...variants];
    const opts = [...updated[groupIdx].options];
    opts[optIdx] = { ...opts[optIdx], [field]: value };
    updated[groupIdx] = { ...updated[groupIdx], options: opts };
    onChange(updated);
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-medium text-gray-700">Varian Produk</label>
        <button
          type="button"
          onClick={addGroup}
          className="text-xs text-green-600 hover:text-green-700 font-medium"
        >
          + Tambah Varian
        </button>
      </div>

      {variants.length === 0 && (
        <p className="text-xs text-gray-400">Belum ada varian. Contoh: Ukuran, Warna, Rasa.</p>
      )}

      {variants.map((group, gIdx) => (
        <div key={gIdx} className="border border-gray-200 rounded-lg p-3 space-y-2">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={group.label}
              onChange={(e) => updateGroupLabel(gIdx, e.target.value)}
              placeholder="Nama varian (cth: Ukuran)"
              className="flex-1 px-2 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-600 focus:border-transparent outline-none"
            />
            <button
              type="button"
              onClick={() => removeGroup(gIdx)}
              className="text-red-500 hover:text-red-700 text-sm px-2"
            >
              Hapus
            </button>
          </div>

          <div className="space-y-1.5 pl-2">
            {group.options.map((opt, oIdx) => (
              <div key={oIdx} className="flex items-center gap-2">
                <input
                  type="text"
                  value={opt.name}
                  onChange={(e) => updateOption(gIdx, oIdx, 'name', e.target.value)}
                  placeholder="Pilihan (cth: L)"
                  className="flex-1 px-2 py-1 text-sm border border-gray-200 rounded focus:ring-1 focus:ring-green-600 outline-none"
                />
                <div className="flex items-center gap-1">
                  <span className="text-xs text-gray-400">+Rp</span>
                  <input
                    type="number"
                    value={opt.priceAdjust || ''}
                    onChange={(e) => updateOption(gIdx, oIdx, 'priceAdjust', parseInt(e.target.value) || 0)}
                    placeholder="0"
                    className="w-20 px-2 py-1 text-sm border border-gray-200 rounded focus:ring-1 focus:ring-green-600 outline-none"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeOption(gIdx, oIdx)}
                  className="text-gray-400 hover:text-red-500 text-lg leading-none"
                >
                  &times;
                </button>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={() => addOption(gIdx)}
            className="text-xs text-green-600 hover:text-green-700 pl-2"
          >
            + Tambah Pilihan
          </button>
        </div>
      ))}
    </div>
  );
}
