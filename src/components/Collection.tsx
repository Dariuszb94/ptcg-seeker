import { useState, useEffect } from 'react';
import { storageService, type StoredCard } from '../services/storage';
import { X } from 'lucide-react';
import { cardGridStyles } from '../styles/cardStyles';

export function Collection() {
  const [cards, setCards] = useState<StoredCard[]>([]);

  const loadCards = () => {
    const collection = storageService.getCollection();
    setCards(collection);
  };

  useEffect(() => {
    const collection = storageService.getCollection();
    setCards(collection);
  }, []);

  const handleRemove = (cardId: string) => {
    storageService.removeFromCollection(cardId);
    loadCards();
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '1400px', margin: '0 auto' }}>
      <h2 style={{ ...cardGridStyles.title, fontSize: '2.2rem' }}>
        My Collection ({cards.length} cards)
      </h2>

      {cards.length === 0 ? (
        <div style={cardGridStyles.emptyState}>
          <p>Your collection is empty. Start adding cards from the sets!</p>
        </div>
      ) : (
        <div style={cardGridStyles.grid}>
          {cards.map((card) => (
            <div
              key={card.id}
              style={cardGridStyles.card}
              onMouseEnter={(e) => {
                Object.assign(e.currentTarget.style, cardGridStyles.cardHover);
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'none';
                e.currentTarget.style.boxShadow =
                  '0 4px 20px rgba(0, 0, 0, 0.2)';
                e.currentTarget.style.borderColor = 'rgba(100, 108, 255, 0.1)';
              }}
            >
              <button
                onClick={() => handleRemove(card.id)}
                style={{
                  position: 'absolute',
                  top: '0.75rem',
                  right: '0.75rem',
                  backgroundColor: 'rgba(255, 68, 68, 0.9)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '50%',
                  width: '32px',
                  height: '32px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.3s ease',
                  zIndex: 1,
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#cc0000';
                  e.currentTarget.style.transform = 'scale(1.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor =
                    'rgba(255, 68, 68, 0.9)';
                  e.currentTarget.style.transform = 'scale(1)';
                }}
                title='Remove from collection'
              >
                <X size={18} />
              </button>
              <img
                src={card.image}
                alt={card.name}
                loading='lazy'
                style={cardGridStyles.cardImage}
                onError={(e) => {
                  const img = e.target as HTMLImageElement;
                  if (img.src.endsWith('.webp')) {
                    img.src = img.src.replace('.webp', '.png');
                  }
                }}
              />
              <p style={cardGridStyles.cardName}>{card.name}</p>
              <p style={cardGridStyles.cardId}>#{card.localId}</p>
              {card.setName && (
                <p
                  style={{
                    fontSize: '0.85rem',
                    color: '#888',
                    marginTop: '0.25rem',
                  }}
                >
                  {card.setName}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
