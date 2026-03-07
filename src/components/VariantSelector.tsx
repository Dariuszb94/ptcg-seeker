import React from 'react';

interface VariantOption {
  id: string;
  label: string;
}

interface VariantSelectorProps {
  variants: VariantOption[];
  value?: string | null;
  onChange?: (id: string) => void;
  className?: string;
}

export const VariantSelector: React.FC<VariantSelectorProps> = ({
  variants,
  value,
  onChange,
  className,
}) => {
  if (!variants || variants.length === 0) return null;

  return (
    <div
      className={className}
      style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}
    >
      {variants.map((v) => {
        const active = value === v.id;
        return (
          <button
            key={v.id}
            onClick={() => onChange && onChange(v.id)}
            aria-pressed={active}
            style={{
              padding: '0.45rem 0.9rem',
              borderRadius: 9999,
              border: active ? `2px solid var(--accent)` : '1px solid rgba(255,255,255,0.06)',
              background: active ? 'linear-gradient(90deg, rgba(100,108,255,0.12), rgba(118,75,162,0.08))' : 'transparent',
              color: active ? 'white' : 'var(--muted)',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '0.9rem',
              transition: 'transform 160ms ease, box-shadow 160ms ease',
              boxShadow: active ? 'var(--shadow-sm)' : 'none',
              backdropFilter: active ? 'blur(6px)' : 'none',
            }}
          >
            {v.label}
          </button>
        );
      })}
    </div>
  );
};

export default VariantSelector;
