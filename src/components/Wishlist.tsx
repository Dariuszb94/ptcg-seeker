import { useState, useEffect } from 'react';
import { storageService, type StoredCard } from '../services/storage';
import { X } from 'lucide-react';
import { cardGridStyles } from '../styles/cardStyles';
import { CardModal } from './CardModal';

export function Wishlist() {
  const [cards, setCards] = useState<StoredCard[]>([]);
  const [selectedCard, setSelectedCard] = useState<StoredCard | null>(null);

  const loadCards = () => {
    const wishlist = storageService.getWishlist();
    setCards(wishlist);
  };

  useEffect(() => {
    const wishlist = storageService.getWishlist();
    setCards(wishlist);
  }, []);

  const handleRemove = (cardId: string) => {
    storageService.removeFromWishlist(cardId);
    loadCards();
  };

  // Handle ESC key to close modal
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedCard(null);
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, []);

  return (
    <>
      <CardModal card={selectedCard} onClose={() => setSelectedCard(null)} />
      <div style={{ padding: '2rem', maxWidth: '1400px', margin: '0 auto' }}>
        <h2 style={{ ...cardGridStyles.title, fontSize: '2.2rem' }}>
          My Wishlist ({cards.length} cards)
        </h2>

        {cards.length === 0 ? (
          <div style={cardGridStyles.emptyState}>
            <p>
              Your wishlist is empty. Start adding cards you want to collect!
            </p>
          </div>
        ) : (
          <div style={cardGridStyles.grid}>
            {cards.map((card) => (
              <div
                key={card.id}
                style={cardGridStyles.card}
                onMouseEnter={(e) => {
                  Object.assign(
                    e.currentTarget.style,
                    cardGridStyles.cardHover
                  );
                  const button = e.currentTarget.querySelector(
                    '.remove-button'
                  ) as HTMLElement;
                  if (button) button.style.opacity = '1';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'none';
                  e.currentTarget.style.boxShadow =
                    '0 4px 20px rgba(0, 0, 0, 0.2)';
                  e.currentTarget.style.borderColor =
                    'rgba(100, 108, 255, 0.1)';
                  const button = e.currentTarget.querySelector(
                    '.remove-button'
                  ) as HTMLElement;
                  if (button) button.style.opacity = '0';
                }}
              >
                <button
                  className='remove-button'
                  onClick={() => handleRemove(card.id)}
                  style={{
                    position: 'absolute',
                    top: '0.5rem',
                    right: '0.5rem',
                    backgroundColor: 'rgba(255, 68, 68, 0.9)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '50%',
                    width: '28px',
                    height: '28px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.3s ease',
                    zIndex: 1,
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.4)',
                    backdropFilter: 'blur(10px)',
                    opacity: 0,
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
                  title='Remove from wishlist'
                >
                  <X size={16} />
                </button>
                <img
                  src={card.image}
                  alt={card.name}
                  loading='lazy'
                  style={{
                    ...cardGridStyles.cardImage,
                    cursor: 'pointer',
                  }}
                  onClick={() => setSelectedCard(card)}
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
                      fontSize: '0.7rem',
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
    </>
  );
}
