import styled from 'styled-components';
import { createPortal } from 'react-dom';
import { X, Plus, Check, Heart, Star } from 'lucide-react';
import { useState } from 'react';

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 2rem;
  animation: fadeIn 0.3s ease;
`;

const ModalContent = styled.div`
  position: relative;
  max-width: 500px;
  max-height: 90vh;
  animation: scaleIn 0.3s ease;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  background-color: rgba(0, 0, 0, 0.6);
  color: #fff;
  border: none;
  border-radius: 8px;
  width: 32px;
  height: 32px;
  min-width: 32px;
  min-height: 32px;
  padding: 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  z-index: 1001;
  backdrop-filter: blur(10px);
  flex-shrink: 0;

  &:hover {
    background-color: rgba(0, 0, 0, 0.8);
    transform: none;
  }
`;

const ModalCard = styled.div`
  background-color: rgba(42, 42, 62, 0.95);
  backdrop-filter: blur(20px);
  border-radius: 16px;
  padding: 1.5rem;
  border: 1px solid rgba(100, 108, 255, 0.3);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
`;

const ImageContainer = styled.div`
  position: relative;
  width: 100%;
  padding-bottom: 139.5%;
  background-color: rgba(100, 108, 255, 0.05);
  border-radius: 12px;
  overflow: hidden;
`;

const ImagePlaceholder = styled.div`
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

const CardImage = styled.img<{ $loaded: boolean }>`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: contain;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
  opacity: ${(props) => (props.$loaded ? 1 : 0)};
  transition: opacity 0.3s ease;
`;

const CardInfo = styled.div`
  margin-top: 1rem;
  text-align: center;
`;

const CardTitle = styled.h3`
  margin: 0 0 0.5rem 0;
  font-size: 1.5rem;
  font-weight: 700;
  color: #f8f9fa;
`;

const CardLocalId = styled.p`
  margin: 0 0 1rem 0;
  color: #d1d5db;
  font-size: 1rem;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 1rem;
`;

const ModalActionButton = styled.button<{
  $isActive: boolean;
  $activeColor: string;
}>`
  background-color: ${(props) =>
    props.$isActive ? `${props.$activeColor}e6` : 'rgba(42, 42, 62, 0.9)'};
  color: white;
  border: 2px solid
    ${(props) =>
      props.$isActive ? props.$activeColor : 'rgba(100, 108, 255, 0.3)'};
  border-radius: 12px;
  padding: 0.75rem 1.5rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  font-size: 1rem;
  font-weight: 600;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.4);
  }
`;

interface CardModalProps {
  card: {
    id: string;
    localId: string;
    name: string;
    image: string;
  } | null;
  onClose: () => void;
  inCollection?: boolean;
  inWishlist?: boolean;
  onToggleCollection?: () => void;
  onToggleWishlist?: () => void;
}

export function CardModal({
  card,
  onClose,
  inCollection = false,
  inWishlist = false,
  onToggleCollection,
  onToggleWishlist,
}: CardModalProps) {
  const [imageLoadedMap, setImageLoadedMap] = useState<Map<string, boolean>>(
    new Map(),
  );

  if (!card) return null;

  const imageLoaded = imageLoadedMap.get(card.id) ?? false;

  return createPortal(
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <CloseButton onClick={onClose} title='Close (ESC)'>
          <X size={20} strokeWidth={2} />
        </CloseButton>

        <ModalCard>
          <ImageContainer>
            {!imageLoaded && <ImagePlaceholder />}
            <CardImage
              src={card.image.replace('/low.webp', '/high.webp')}
              alt={card.name}
              $loaded={imageLoaded}
              onLoad={() => {
                setImageLoadedMap((prev) => new Map(prev).set(card.id, true));
              }}
              onError={(e) => {
                const img = e.target as HTMLImageElement;
                if (img.src.includes('/high.webp')) {
                  img.src = img.src.replace('/high.webp', '/high.png');
                } else if (img.src.includes('/high.png')) {
                  img.src = img.src.replace('/high.png', '/low.webp');
                } else if (img.src.endsWith('.webp')) {
                  img.src = img.src.replace('.webp', '.png');
                }
              }}
            />
          </ImageContainer>
          <CardInfo>
            <CardTitle>{card.name}</CardTitle>
            <CardLocalId>#{card.localId}</CardLocalId>

            {(onToggleCollection || onToggleWishlist) && (
              <ButtonGroup>
                {onToggleCollection && (
                  <ModalActionButton
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleCollection();
                    }}
                    $isActive={inCollection}
                    $activeColor='#4CAF50'
                  >
                    {inCollection ? (
                      <>
                        <Check size={20} />
                        In Collection
                      </>
                    ) : (
                      <>
                        <Plus size={20} />
                        Add to Collection
                      </>
                    )}
                  </ModalActionButton>
                )}

                {onToggleWishlist && (
                  <ModalActionButton
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleWishlist();
                    }}
                    $isActive={inWishlist}
                    $activeColor='#FF4081'
                  >
                    {inWishlist ? (
                      <>
                        <Star size={20} fill='currentColor' />
                        In Wishlist
                      </>
                    ) : (
                      <>
                        <Heart size={20} />
                        Add to Wishlist
                      </>
                    )}
                  </ModalActionButton>
                )}
              </ButtonGroup>
            )}
          </CardInfo>
        </ModalCard>
      </ModalContent>
    </ModalOverlay>,
    document.body,
  );
}
