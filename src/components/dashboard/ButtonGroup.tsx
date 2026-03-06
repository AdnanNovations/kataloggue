import React from 'react';

interface ButtonGroupProps<T extends string> {
  label: string;
  value: T;
  options: { value: T; label: string }[];
  onChange: (value: T) => void;
}

export default function ButtonGroup<T extends string>({ label, value, options, onChange }: ButtonGroupProps<T>) {
  return (
    <div>
      <label className="text-xs text-gray-500 block mb-1">{label}</label>
      <div className="flex rounded-lg border border-gray-200 overflow-hidden">
        {options.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={`flex-1 px-2 py-1.5 text-xs font-medium transition-colors ${
              value === opt.value
                ? 'bg-gray-900 text-white'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}
