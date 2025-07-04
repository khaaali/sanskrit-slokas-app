import React from 'react';

interface LanguageSelectorProps {
  value: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
  disabled?: boolean;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ value, options, onChange, disabled = false }) => (
  <div className={`flex space-x-1 ${disabled ? 'opacity-50 pointer-events-none' : ''}`}>
    {options.map(option => (
      <button
        key={option.value}
        type="button"
        aria-label={option.label}
        className={`rounded-md border text-xs px-2 py-1 focus:outline-none transition-colors
          ${value === option.value
            ? 'bg-blue-600 text-white border-blue-600'
            : 'bg-white text-[#2C3E50] border-[#C0C0C0] hover:bg-blue-50'}
        `}
        style={{ minWidth: '28px', height: '28px', fontSize: '0.75rem' }}
        onClick={!disabled ? () => onChange(option.value) : undefined}
        disabled={disabled}
      >
        {option.label}
      </button>
    ))}
  </div>
);

export default LanguageSelector; 