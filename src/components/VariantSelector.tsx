import React from 'react';
import styled from 'styled-components';

const VariantContainer = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  justify-content: center;
`;

const VariantButton = styled.button<{ $active: boolean }>`
  padding: 0.45rem 0.9rem;
  border-radius: 9999px;
  border: ${(props) =>
    props.$active
      ? '2px solid var(--accent)'
      : '1px solid rgba(255, 255, 255, 0.06)'};
  background: ${(props) =>
    props.$active
      ? 'linear-gradient(90deg, rgba(100, 108, 255, 0.12), rgba(118, 75, 162, 0.08))'
      : 'transparent'};
  color: ${(props) => (props.$active ? 'white' : 'var(--text-muted)')};
  cursor: pointer;
  font-weight: 600;
  font-size: 0.9rem;
  transition:
    transform 160ms ease,
    box-shadow 160ms ease;
  box-shadow: ${(props) => (props.$active ? 'var(--shadow-sm)' : 'none')};
  backdrop-filter: ${(props) => (props.$active ? 'blur(6px)' : 'none')};

  &:hover {
    transform: translateY(-2px);
  }
`;

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
    <VariantContainer className={className}>
      {variants.map((v) => {
        const active = value === v.id;
        return (
          <VariantButton
            key={v.id}
            onClick={() => onChange && onChange(v.id)}
            aria-pressed={active}
            $active={active}
          >
            {v.label}
          </VariantButton>
        );
      })}
    </VariantContainer>
  );
};

export default VariantSelector;
