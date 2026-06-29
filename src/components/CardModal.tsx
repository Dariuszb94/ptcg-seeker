import { createPortal } from 'react-dom';
import { X, Plus, Check, Heart, Star } from 'lucide-react';
import { useState } from 'react';

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
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '2rem',
        animation: 'fadeIn 0.3s ease',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          position: 'relative',
          maxWidth: '500px',
          maxHeight: '90vh',
          animation: 'scaleIn 0.3s ease',
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '0.5rem',
            right: '0.5rem',
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            width: '32px',
            height: '32px',
            minWidth: '32px',
            minHeight: '32px',
            padding: 0,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s ease',
            zIndex: 1001,
            backdropFilter: 'blur(10px)',
            flexShrink: 0,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.6)';
          }}
          title='Close (ESC)'
        >
          <X size={20} strokeWidth={2} />
        </button>

        <div
          style={{
            backgroundColor: 'rgba(42, 42, 62, 0.95)',
            backdropFilter: 'blur(20px)',
            borderRadius: '16px',
            padding: '1.5rem',
            border: '1px solid rgba(100, 108, 255, 0.3)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
          }}
        >
          <div
            style={{
              position: 'relative',
              width: '100%',
              paddingBottom: '139.5%', // Pokemon card aspect ratio
              backgroundColor: 'rgba(100, 108, 255, 0.05)',
              borderRadius: '12px',
              overflow: 'hidden',
            }}
          >
            {!imageLoaded && (
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background:
                    'linear-gradient(90deg, rgba(100, 108, 255, 0.05) 25%, rgba(100, 108, 255, 0.15) 50%, rgba(100, 108, 255, 0.05) 75%)',
                  backgroundSize: '200% 100%',
                  animation: 'shimmer 1.5s infinite',
                }}
              />
            )}
            <img
              src={card.image.replace('/low.webp', '/high.webp')}
              alt={card.name}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                borderRadius: '12px',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
                opacity: imageLoaded ? 1 : 0,
                transition: 'opacity 0.3s ease',
              }}
              onLoad={() => {
                setImageLoadedMap((prev) => new Map(prev).set(card.id, true));
              }}
              onError={(e) => {
                const img = e.target as HTMLImageElement;
                // Try PNG if webp fails
                if (img.src.includes('/high.webp')) {
                  img.src = img.src.replace('/high.webp', '/high.png');
                } else if (img.src.includes('/high.png')) {
                  // Fallback to low quality
                  img.src = img.src.replace('/high.png', '/low.webp');
                } else if (img.src.endsWith('.webp')) {
                  img.src = img.src.replace('.webp', '.png');
                }
              }}
            />
          </div>
          <div style={{ marginTop: '1rem', textAlign: 'center' }}>
            <h3
              style={{
                margin: '0 0 0.5rem 0',
                fontSize: '1.5rem',
                fontWeight: '700',
                color: '#f8f9fa',
              }}
            >
              {card.name}
            </h3>
            <p
              style={{
                margin: '0 0 1rem 0',
                color: '#d1d5db',
                fontSize: '1rem',
              }}
            >
              #{card.localId}
            </p>

            {/* Collection and Wishlist buttons */}
            {(onToggleCollection || onToggleWishlist) && (
              <div
                style={{
                  display: 'flex',
                  gap: '1rem',
                  justifyContent: 'center',
                  marginTop: '1rem',
                }}
              >
                {onToggleCollection && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleCollection();
                    }}
                    style={{
                      backgroundColor: inCollection
                        ? 'rgba(76, 175, 80, 0.9)'
                        : 'rgba(42, 42, 62, 0.9)',
                      color: 'white',
                      border: inCollection
                        ? '2px solid #4CAF50'
                        : '2px solid rgba(100, 108, 255, 0.3)',
                      borderRadius: '12px',
                      padding: '0.75rem 1.5rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      transition: 'all 0.3s ease',
                      fontSize: '1rem',
                      fontWeight: '600',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow =
                        '0 6px 16px rgba(0, 0, 0, 0.4)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow =
                        '0 4px 12px rgba(0, 0, 0, 0.3)';
                    }}
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
                  </button>
                )}

                {onToggleWishlist && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleWishlist();
                    }}
                    style={{
                      backgroundColor: inWishlist
                        ? 'rgba(255, 64, 129, 0.9)'
                        : 'rgba(42, 42, 62, 0.9)',
                      color: 'white',
                      border: inWishlist
                        ? '2px solid #FF4081'
                        : '2px solid rgba(100, 108, 255, 0.3)',
                      borderRadius: '12px',
                      padding: '0.75rem 1.5rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      transition: 'all 0.3s ease',
                      fontSize: '1rem',
                      fontWeight: '600',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow =
                        '0 6px 16px rgba(0, 0, 0, 0.4)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow =
                        '0 4px 12px rgba(0, 0, 0, 0.3)';
                    }}
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
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
