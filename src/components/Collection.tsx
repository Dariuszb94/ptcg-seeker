import { useState, useEffect, useMemo } from 'react';
import { storageService, type StoredCard } from '../services/storage';
import { X } from 'lucide-react';
import { cardGridStyles } from '../styles/cardStyles';
import { CardModal } from './CardModal';

export function Collection() {
  const [cards, setCards] = useState<StoredCard[]>(() =>
    storageService.getCollection(),
  );
  const [selectedCard, setSelectedCard] = useState<StoredCard | null>(null);
  const [hoveredCardId, setHoveredCardId] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());

  // Detect mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 800);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const loadCards = () => {
    const collection = storageService.getCollection();
    setCards(collection);
  };

  // Sort cards by set name, then by local ID
  const sortedCards = useMemo(() => {
    return [...cards].sort((a, b) => {
      // Sort by set name first
      const setCompare = (a.setName || '').localeCompare(b.setName || '');
      if (setCompare !== 0) return setCompare;
      // Then by local ID within the same set
      return (a.localId || '').localeCompare(b.localId || '', undefined, {
        numeric: true,
      });
    });
  }, [cards]);

  const handleRemove = (cardId: string) => {
    storageService.removeFromCollection(cardId);
    loadCards();
    // Close modal if the removed card is currently selected
    if (selectedCard && selectedCard.id === cardId) {
      setSelectedCard(null);
    }
  };

  const handleToggleWishlist = () => {
    if (!selectedCard) return;

    const wishlist = storageService.getWishlist();
    const inWishlist = wishlist.some((c) => c.id === selectedCard.id);

    if (inWishlist) {
      storageService.removeFromWishlist(selectedCard.id);
    } else {
      storageService.addToWishlist(selectedCard);
    }
    // Force re-render by creating new card object
    setSelectedCard({ ...selectedCard });
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
      <CardModal
        card={selectedCard}
        onClose={() => setSelectedCard(null)}
        inCollection={true}
        inWishlist={
          selectedCard
            ? storageService.getWishlist().some((c) => c.id === selectedCard.id)
            : false
        }
        onToggleCollection={
          selectedCard ? () => handleRemove(selectedCard.id) : undefined
        }
        onToggleWishlist={selectedCard ? handleToggleWishlist : undefined}
      />
      <div style={{ padding: '2rem', maxWidth: '1400px', margin: '0 auto' }}>
        <h2 style={{ ...cardGridStyles.title, fontSize: '2.2rem' }}>
          My Collection ({sortedCards.length} cards)
        </h2>

        {sortedCards.length === 0 ? (
          <div style={cardGridStyles.emptyState}>
            <p>Your collection is empty. Start adding cards from the sets!</p>
          </div>
        ) : (
          <div style={cardGridStyles.grid}>
            {sortedCards.map((card) => (
              <div
                key={card.id}
                style={cardGridStyles.card}
                onMouseEnter={() => setHoveredCardId(card.id)}
                onMouseLeave={() => setHoveredCardId(null)}
              >
                <div
                  style={{
                    position: 'relative',
                    width: '100%',
                    paddingBottom: '139.5%', // Pokemon card aspect ratio
                    backgroundColor: 'rgba(100, 108, 255, 0.05)',
                    borderRadius: '8px',
                    overflow: 'hidden',
                  }}
                >
                  {!loadedImages.has(card.id) && (
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
                    src={card.image}
                    alt={card.name}
                    loading='lazy'
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      objectFit: 'contain',
                      borderRadius: '8px',
                      boxShadow: '0 4px 16px rgba(0, 0, 0, 0.3)',
                      cursor: 'pointer',
                      opacity: loadedImages.has(card.id) ? 1 : 0,
                      transition: 'opacity 0.3s ease',
                    }}
                    onClick={() => setSelectedCard(card)}
                    onLoad={() => {
                      setLoadedImages((prev) => new Set([...prev, card.id]));
                    }}
                    onError={(e) => {
                      const img = e.target as HTMLImageElement;
                      if (img.src.endsWith('.webp')) {
                        img.src = img.src.replace('.webp', '.png');
                      }
                    }}
                  />
                </div>
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
                <button
                  className='remove-button'
                  onClick={() => handleRemove(card.id)}
                  style={cardGridStyles.getRemoveButton(
                    isMobile,
                    hoveredCardId === card.id,
                  )}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#cc0000';
                    if (!isMobile) {
                      e.currentTarget.style.transform = 'scale(1.1)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor =
                      'rgba(255, 68, 68, 0.9)';
                    if (!isMobile) {
                      e.currentTarget.style.transform = 'scale(1)';
                    }
                  }}
                  title='Remove from collection'
                >
                  <X size={16} strokeWidth={2} />
                  {isMobile && <span>Remove</span>}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
