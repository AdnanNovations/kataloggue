import { useState } from 'react';
import type { VariantGroup } from '../../lib/db';
import { formatPrice, waOrderUrl } from '../../lib/utils';
import type { VariantSelection } from '../../lib/utils';

interface Props {
  basePrice: number;
  variants: VariantGroup[];
  phone: string;
  storeName: string;
  productName: string;
  isAvailable: boolean;
}

export default function VariantSelector({ basePrice, variants, phone, storeName, productName, isAvailable }: Props) {
  const [selected, setSelected] = useState<Record<string, number>>(() => {
    const init: Record<string, number> = {};
    variants.forEach((g, i) => { init[i] = 0; });
    return init;
  });

  const totalAdjust = variants.reduce((sum, group, gIdx) => {
    const optIdx = selected[gIdx] ?? 0;
    return sum + (group.options[optIdx]?.priceAdjust || 0);
  }, 0);

  const totalPrice = basePrice + totalAdjust;

  const variantSelections: VariantSelection[] = variants.map((group, gIdx) => ({
    label: group.label,
    option: group.options[selected[gIdx] ?? 0]?.name || '',
  }));

  const waUrl = waOrderUrl(phone, storeName, productName, totalPrice, variants.length > 0 ? variantSelections : undefined);

  return (
    <div>
      {/* Price */}
      <div className="mt-3 sm:mt-4">
        <span className="text-2xl sm:text-3xl font-bold" style={{ color: 'var(--cs-price)' }}>
          {formatPrice(totalPrice)}
        </span>
      </div>

      {/* Variant groups */}
      {variants.length > 0 && (
        <div className="mt-3 sm:mt-4 space-y-3">
          {variants.map((group, gIdx) => (
            <div key={gIdx}>
              <label className="text-xs sm:text-sm font-medium mb-1.5 block" style={{ color: 'var(--cs-product-name)' }}>
                {group.label}
              </label>
              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {group.options.map((opt, oIdx) => {
                  const isSelected = (selected[gIdx] ?? 0) === oIdx;
                  return (
                    <button
                      key={oIdx}
                      type="button"
                      onClick={() => setSelected(prev => ({ ...prev, [gIdx]: oIdx }))}
                      className={`px-3 py-1.5 text-xs sm:text-sm rounded-full border transition-colors ${
                        isSelected
                          ? 'border-green-500 bg-green-50 text-green-700 font-medium'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                      style={!isSelected ? { color: 'var(--cs-detail-text)' } : undefined}
                    >
                      {opt.name}
                      {opt.priceAdjust > 0 && (
                        <span className="ml-1 opacity-70">(+{formatPrice(opt.priceAdjust)})</span>
                      )}
                      {opt.priceAdjust < 0 && (
                        <span className="ml-1 opacity-70">({formatPrice(opt.priceAdjust)})</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Out of stock badge */}
      {!isAvailable && (
        <div className="mt-2 sm:mt-3 inline-block px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs sm:text-sm font-medium">
          Stok Habis
        </div>
      )}

      {/* WhatsApp button */}
      <div className="mt-5 sm:mt-8">
        <a
          href={waUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full flex items-center justify-center gap-2 text-white font-semibold py-3 sm:py-4 px-6 rounded-xl text-base sm:text-lg transition-colors hover:opacity-90"
          style={{ backgroundColor: '#25D366' }}
        >
          <svg className="w-5 h-5 sm:w-6 sm:h-6" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
          Order via WhatsApp
        </a>
      </div>
    </div>
  );
}
