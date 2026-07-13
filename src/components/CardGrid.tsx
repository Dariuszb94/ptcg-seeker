import { useState, useEffect } from 'react';
import { pokemonTcgApi, formatImageUrl } from '../services/pokemon-tcg-api';
import { storageService, type StoredCard } from '../services/storage';
import { Heart, Plus, Check, Star } from 'lucide-react';
import {
  CardGridContainer,
  CardGridTitle,
  CardGrid,
  CardItem,
  CardImageContainer,
  CardImagePlaceholder,
  CardImage,
  CardName,
  CardId,
  ButtonContainer,
  ActionButton,
  LoadingText,
  ErrorBox,
} from '../styles/SharedStyledComponents';
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
    return <LoadingText>Loading cards...</LoadingText>;
  }

  if (error) {
    return <ErrorBox><p>Error: {error}</p></ErrorBox>;
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
      <CardGridContainer>
        <CardGridTitle>Cards in this Set ({cards.length})</CardGridTitle>
        <CardGrid>
          {cards.map((card) => {
            const inCollection = collectionIds.has(card.id);
            const inWishlist = wishlistIds.has(card.id);

            return (
              <CardItem
                key={card.id}
                onMouseEnter={() => setHoveredCardId(card.id)}
                onMouseLeave={() => setHoveredCardId(null)}
              >
                <ButtonContainer 
                  className="card-buttons"
                  $isMobile={isMobile}
                  style={{
                    opacity: isMobile ? 1 : hoveredCardId === card.id ? 1 : 0
                  }}
                >
                  <ActionButton
                    onClick={() =>
                      inCollection
                        ? handleRemoveFromCollection(card.id)
                        : handleAddToCollection(card)
                    }
                    $isActive={inCollection}
                    $activeColor='#4CAF50'
                    $isMobile={isMobile}
                    title={
                      inCollection
                        ? 'Remove from collection'
                        : 'Add to collection'
                    }
                  >
                    {inCollection ? (
                      <Check size={isMobile ? 20 : 24} />
                    ) : (
                      <Plus size={isMobile ? 20 : 24} />
                    )}
                  </ActionButton>

                  <ActionButton
                    onClick={() =>
                      inWishlist
                        ? handleRemoveFromWishlist(card.id)
                        : handleAddToWishlist(card)
                    }
                    $isActive={inWishlist}
                    $activeColor='#FF4081'
                    $isMobile={isMobile}
                    title={
                      inWishlist ? 'Remove from wishlist' : 'Add to wishlist'
                    }
                  >
                    {inWishlist ? (
                      <Star size={isMobile ? 20 : 24} fill='currentColor' />
                    ) : (
                      <Heart size={isMobile ? 20 : 24} />
                    )}
                  </ActionButton>
                </ButtonContainer>

                <CardImageContainer>
                  {!loadedImages.has(card.id) && <CardImagePlaceholder />}
                  <CardImage
                    src={card.image}
                    alt={card.name}
                    loading='lazy'
                    $loaded={loadedImages.has(card.id)}
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
                </CardImageContainer>
                <CardName>{card.name}</CardName>
                <CardId>#{card.localId}</CardId>
              </CardItem>
            );
          })}
        </CardGrid>
      </CardGridContainer>
    </>
  );
}
