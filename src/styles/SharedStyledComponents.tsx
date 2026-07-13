import styled from 'styled-components';

// Common card grid components
export const CardGridContainer = styled.div`
  margin-top: 2rem;
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
`;

export const CardGridTitle = styled.h2`
  font-size: 1.8rem;
  font-weight: 700;
  color: #f8f9fa;
  margin-bottom: 1.5rem;
`;

export const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 1rem;
  margin-top: 1.5rem;
`;

export const CardItem = styled.div`
  background-color: rgba(42, 42, 62, 0.6);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 0.75rem;
  text-align: center;
  display: flex;
  flex-direction: column;
  border: 1px solid rgba(100, 108, 255, 0.1);
  transition: all 0.3s ease;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  position: relative;

  &:hover {
    transform: translateY(-6px);
    box-shadow: 0 12px 40px rgba(100, 108, 255, 0.3);
    border-color: rgba(100, 108, 255, 0.4);

    .card-buttons {
      opacity: 1;
    }
  }
`;

export const CardImageContainer = styled.div`
  position: relative;
  width: 100%;
  padding-bottom: 139.5%; /* Pokemon card aspect ratio */
  background-color: rgba(100, 108, 255, 0.05);
  border-radius: 8px;
  overflow: hidden;
`;

export const CardImagePlaceholder = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    90deg,
    rgba(100, 108, 255, 0.05) 25%,
    rgba(100, 108, 255, 0.15) 50%,
    rgba(100, 108, 255, 0.05) 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
`;

export const CardImage = styled.img<{ $loaded?: boolean }>`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: contain;
  border-radius: 8px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
  cursor: pointer;
  opacity: ${(props) => (props.$loaded ? 1 : 0)};
  transition: opacity 0.3s ease;
`;

export const CardName = styled.p`
  margin-top: 0.5rem;
  font-weight: 600;
  font-size: 0.85rem;
  color: #f8f9fa;
  line-height: 1.2;
`;

export const CardId = styled.p`
  font-size: 0.75rem;
  color: #d1d5db;
  margin-top: 0.25rem;
`;

export const CardSetName = styled.p`
  font-size: 0.7rem;
  color: #d1d5db;
  margin-top: 0.25rem;
`;

export const ButtonContainer = styled.div<{
  $isMobile?: boolean;
  $hovered?: boolean;
}>`
  position: ${(props) => (props.$isMobile ? 'static' : 'absolute')};
  top: ${(props) => (props.$isMobile ? 'auto' : '0.5rem')};
  right: ${(props) => (props.$isMobile ? 'auto' : '0.5rem')};
  display: flex;
  flex-direction: ${(props) => (props.$isMobile ? 'row' : 'column')};
  gap: ${(props) => (props.$isMobile ? '0.5rem' : '0.4rem')};
  opacity: ${(props) => (props.$isMobile ? 1 : 0)};
  transition: opacity 0.3s ease;
  margin-top: ${(props) => (props.$isMobile ? '0.75rem' : 0)};
  justify-content: ${(props) => (props.$isMobile ? 'center' : 'flex-start')};
  width: ${(props) => (props.$isMobile ? '100%' : 'auto')};
`;

export const ActionButton = styled.button<{
  $isActive?: boolean;
  $activeColor?: string;
  $isMobile?: boolean;
}>`
  padding: ${(props) => (props.$isMobile ? '0.65rem' : '0.4rem')};
  background-color: ${(props) =>
    props.$isActive ? `${props.$activeColor}dd` : 'rgba(0, 0, 0, 0.7)'};
  color: white;
  border: 1px solid
    ${(props) =>
      props.$isActive ? props.$activeColor : 'rgba(255, 255, 255, 0.3)'};
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 500;
  transition: all 0.3s ease;
  box-shadow: ${(props) =>
    props.$isActive
      ? `0 2px 8px ${props.$activeColor}60`
      : '0 2px 8px rgba(0, 0, 0, 0.4)'};
  backdrop-filter: blur(10px);
  width: ${(props) => (props.$isMobile ? '100%' : '32px')};
  height: ${(props) => (props.$isMobile ? '40px' : '32px')};
  flex: ${(props) => (props.$isMobile ? 1 : 'none')};

  &:hover {
    background-color: ${(props) =>
      props.$isActive ? props.$activeColor : 'rgba(76, 175, 80, 0.9)'};
    transform: translateY(-2px);
  }
`;

export const RemoveButton = styled.button<{ $isMobile?: boolean }>`
  position: ${(props) => (props.$isMobile ? 'static' : 'absolute')};
  top: ${(props) => (props.$isMobile ? 'auto' : '0.5rem')};
  right: ${(props) => (props.$isMobile ? 'auto' : '0.5rem')};
  background-color: rgba(255, 68, 68, 0.9);
  color: white;
  border: none;
  border-radius: ${(props) => (props.$isMobile ? '8px' : '50%')};
  width: ${(props) => (props.$isMobile ? '100%' : '28px')};
  height: ${(props) => (props.$isMobile ? '40px' : '28px')};
  min-width: ${(props) => (props.$isMobile ? '100%' : '28px')};
  min-height: ${(props) => (props.$isMobile ? '40px' : '28px')};
  padding: ${(props) => (props.$isMobile ? '0.65rem' : 0)};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${(props) => (props.$isMobile ? '0.5rem' : 0)};
  transition: all 0.3s ease;
  z-index: 1;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(10px);
  opacity: ${(props) => (props.$isMobile ? 1 : 0)};
  flex-shrink: 0;
  margin-top: ${(props) => (props.$isMobile ? '0.75rem' : 0)};
  font-size: ${(props) => (props.$isMobile ? '0.9rem' : 'inherit')};
  font-weight: ${(props) => (props.$isMobile ? '600' : 'normal')};

  &:hover {
    background-color: #cc0000;
    transform: ${(props) => (props.$isMobile ? 'none' : 'scale(1.1)')};
  }
`;

export const EmptyState = styled.div`
  color: #d1d5db;
  text-align: center;
  margin-top: 4rem;
  font-size: 1.1rem;
  padding: 3rem;
  background-color: rgba(42, 42, 62, 0.4);
  border-radius: 16px;
  border: 1px dashed rgba(100, 108, 255, 0.3);
`;

export const LoadingText = styled.p`
  color: #d1d5db;
  margin-top: 1rem;
`;

export const ErrorBox = styled.div`
  padding: 1rem;
  background-color: #ff000020;
  border-radius: 4px;
  color: #ff6b6b;
  margin-top: 1rem;
`;
