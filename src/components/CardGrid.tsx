import { useState, useEffect } from 'react';
import { pokemonTcgApi, formatImageUrl } from '../services/pokemon-tcg-api';
import { storageService, type StoredCard } from '../services/storage';
import { Heart, Plus, Check, Star } from 'lucide-react';
import { cardGridStyles } from '../styles/cardStyles';
import { CardModal } from './CardModal';

interface CardSummary {
  id: string;
  localId: string;
  name: string;
  image: string;
}

interface CardGridProps {
  setId: string;
  setName?: string;
}

export function CardGrid({ setId, setName }: CardGridProps) {
  const [cards, setCards] = useState<CardSummary[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [collectionIds, setCollectionIds] = useState<Set<string>>(new Set());
  const [wishlistIds, setWishlistIds] = useState<Set<string>>(new Set());
  const [selectedCard, setSelectedCard] = useState<CardSummary | null>(null);
  const [hoveredCardId, setHoveredCardId] = useState<string | null>(null);

  // Load collection and wishlist IDs
  useEffect(() => {
    const collection = storageService.getCollection();
    const wishlist = storageService.getWishlist();
    setCollectionIds(new Set(collection.map((c) => c.id)));
    setWishlistIds(new Set(wishlist.map((c) => c.id)));
  }, []);

  const handleAddToCollection = (card: CardSummary) => {
    const storedCard: StoredCard = {
      id: card.id,
      localId: card.localId,
      name: card.name,
      image: card.image,
      setId,
      setName: setName || '',
      addedAt: new Date().toISOString(),
    };
    storageService.addToCollection(storedCard);
    setCollectionIds(new Set([...collectionIds, card.id]));
  };

  const handleRemoveFromCollection = (cardId: string) => {
    storageService.removeFromCollection(cardId);
    const newIds = new Set(collectionIds);
    newIds.delete(cardId);
    setCollectionIds(newIds);
  };

  const handleAddToWishlist = (card: CardSummary) => {
    const storedCard: StoredCard = {
      id: card.id,
      localId: card.localId,
      name: card.name,
      image: card.image,
      setId,
      setName: setName || '',
      addedAt: new Date().toISOString(),
    };
    storageService.addToWishlist(storedCard);
    setWishlistIds(new Set([...wishlistIds, card.id]));
  };

  const handleRemoveFromWishlist = (cardId: string) => {
    storageService.removeFromWishlist(cardId);
    const newIds = new Set(wishlistIds);
    newIds.delete(cardId);
    setWishlistIds(newIds);
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

  // Load cards automatically when setId changes
  useEffect(() => {
    const loadCards = async () => {
      try {
        setLoading(true);
        setError(null);
        const cardsData = await pokemonTcgApi.getCardsFromSet(setId);
        // Map to ensure we have the required CardSummary structure
        // TCGdex images need format: {imageUrl}/low.webp or {imageUrl}/high.webp
        const cardSummaries = cardsData.map((card) => ({
          id: card.id,
          localId: card.localId,
          name: card.name,
          image: formatImageUrl(card.image, 'low', 'webp'),
        }));
        setCards(cardSummaries);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch cards');
        console.error('Error fetching cards:', err);
      } finally {
        setLoading(false);
      }
    };

    loadCards();
  }, [setId]);

  if (loading) {
    return <p style={{ color: '#888', marginTop: '1rem' }}>Loading cards...</p>;
  }

  if (error) {
    return (
      <div
        style={{
          padding: '1rem',
          backgroundColor: '#ff000020',
          borderRadius: '4px',
          color: '#ff6b6b',
          marginTop: '1rem',
        }}
      >
        <p>Error: {error}</p>
      </div>
    );
  }

  return (
    <>
      <CardModal
        card={selectedCard}
        onClose={() => setSelectedCard(null)}
        inCollection={selectedCard ? collectionIds.has(selectedCard.id) : false}
        inWishlist={selectedCard ? wishlistIds.has(selectedCard.id) : false}
        onToggleCollection={
          selectedCard
            ? () => {
                if (collectionIds.has(selectedCard.id)) {
                  handleRemoveFromCollection(selectedCard.id);
                } else {
                  handleAddToCollection(selectedCard);
                }
              }
            : undefined
        }
        onToggleWishlist={
          selectedCard
            ? () => {
                if (wishlistIds.has(selectedCard.id)) {
                  handleRemoveFromWishlist(selectedCard.id);
                } else {
                  handleAddToWishlist(selectedCard);
                }
              }
            : undefined
        }
      />
      <div style={cardGridStyles.container}>
        <h3 style={cardGridStyles.title}>Cards in this Set ({cards.length})</h3>
        <div style={cardGridStyles.grid}>
          {cards.map((card) => {
            const inCollection = collectionIds.has(card.id);
            const inWishlist = wishlistIds.has(card.id);

            return (
              <div
                key={card.id}
                style={cardGridStyles.card}
                onMouseEnter={() => setHoveredCardId(card.id)}
                onMouseLeave={() => setHoveredCardId(null)}
              >
                <div
                  className='card-buttons'
                  style={{
                    ...cardGridStyles.buttonContainer,
                    opacity: hoveredCardId === card.id ? 1 : 0,
                  }}
                >
                  <button
                    onClick={() =>
                      inCollection
                        ? handleRemoveFromCollection(card.id)
                        : handleAddToCollection(card)
                    }
                    style={cardGridStyles.button(inCollection, '#4CAF50')}
                    onMouseEnter={(e) => {
                      if (!inCollection) {
                        e.currentTarget.style.backgroundColor =
                          'rgba(76, 175, 80, 0.9)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!inCollection) {
                        e.currentTarget.style.backgroundColor =
                          'rgba(0, 0, 0, 0.7)';
                      }
                    }}
                    title={
                      inCollection
                        ? 'Remove from collection'
                        : 'Add to collection'
                    }
                  >
                    {inCollection ? <Check size={24} /> : <Plus size={24} />}
                  </button>

                  <button
                    onClick={() =>
                      inWishlist
                        ? handleRemoveFromWishlist(card.id)
                        : handleAddToWishlist(card)
                    }
                    style={cardGridStyles.button(inWishlist, '#FF4081')}
                    onMouseEnter={(e) => {
                      if (!inWishlist) {
                        e.currentTarget.style.backgroundColor =
                          'rgba(255, 64, 129, 0.9)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!inWishlist) {
                        e.currentTarget.style.backgroundColor =
                          'rgba(0, 0, 0, 0.7)';
                      }
                    }}
                    title={
                      inWishlist ? 'Remove from wishlist' : 'Add to wishlist'
                    }
                  >
                    {inWishlist ? (
                      <Star size={24} fill='currentColor' />
                    ) : (
                      <Heart size={24} />
                    )}
                  </button>
                </div>

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
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
