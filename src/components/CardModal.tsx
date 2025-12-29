import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

interface CardModalProps {
  card: {
    id: string;
    localId: string;
    name: string;
    image: string;
  } | null;
  onClose: () => void;
}

export function CardModal({ card, onClose }: CardModalProps) {
  if (!card) return null;

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
      <style>
        {`
          @keyframes fadeIn {
            from {
              opacity: 0;
            }
            to {
              opacity: 1;
            }
          }
          @keyframes scaleIn {
            from {
              transform: scale(0.8);
              opacity: 0;
            }
            to {
              transform: scale(1);
              opacity: 1;
            }
          }
        `}
      </style>
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
            top: '-1rem',
            right: '-1rem',
            backgroundColor: 'rgba(255, 68, 68, 0.9)',
            color: 'white',
            border: 'none',
            borderRadius: '50%',
            width: '40px',
            height: '40px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.3s ease',
            zIndex: 1001,
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.5)',
            backdropFilter: 'blur(10px)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#cc0000';
            e.currentTarget.style.transform = 'scale(1.1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'rgba(255, 68, 68, 0.9)';
            e.currentTarget.style.transform = 'scale(1)';
          }}
          title='Close (ESC)'
        >
          <X size={24} />
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
          <img
            src={card.image.replace('/low.webp', '/high.webp')}
            alt={card.name}
            style={{
              width: '100%',
              height: 'auto',
              borderRadius: '12px',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
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
          <div style={{ marginTop: '1rem', textAlign: 'center' }}>
            <h3
              style={{
                margin: '0 0 0.5rem 0',
                fontSize: '1.5rem',
                fontWeight: '700',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              {card.name}
            </h3>
            <p style={{ margin: 0, color: '#a0a0c0', fontSize: '1rem' }}>
              #{card.localId}
            </p>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
