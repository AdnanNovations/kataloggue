import React from 'react';

interface ColorInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

export default function ColorInput({ label, value, onChange }: ColorInputProps) {
  return (
    <div className="flex items-center gap-2">
      <input
        type="color"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-8 h-8 rounded cursor-pointer border border-gray-300 p-0"
      />
      <div className="flex-1">
        <label className="text-xs text-gray-500 block">{label}</label>
        <input
          type="text"
          value={value}
          onChange={(e) => {
            const v = e.target.value;
            if (/^#[0-9a-fA-F]{0,6}$/.test(v)) onChange(v);
          }}
          className="w-full text-sm font-mono border border-gray-200 rounded px-2 py-0.5 mt-0.5"
          maxLength={7}
        />
      </div>
    </div>
  );
}
