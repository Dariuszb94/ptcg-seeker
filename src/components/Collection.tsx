import { useState, useEffect, useMemo } from 'react';
import styled from 'styled-components';
import { storageService, type StoredCard } from '../services/storage';
import { X } from 'lucide-react';
import { CardModal } from './CardModal';
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
  CardSetName,
  RemoveButton,
  EmptyState,
} from '../styles/SharedStyledComponents';

// Local styled components specific to Collection
const CollectionTitle = styled(CardGridTitle)`
  font-size: 2.2rem;
`;

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
      <CardGridContainer>
        <CollectionTitle>
          My Collection ({sortedCards.length} cards)
        </CollectionTitle>

        {sortedCards.length === 0 ? (
          <EmptyState>
            <p>Your collection is empty. Start adding cards from the sets!</p>
          </EmptyState>
        ) : (
          <CardGrid>
            {sortedCards.map((card) => (
              <CardItem
                key={card.id}
                onMouseEnter={() => setHoveredCardId(card.id)}
                onMouseLeave={() => setHoveredCardId(null)}
              >
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
                {card.setName && <CardSetName>{card.setName}</CardSetName>}
                <RemoveButton
                  className='remove-button'
                  onClick={() => handleRemove(card.id)}
                  $isMobile={isMobile}
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
                </RemoveButton>
              </CardItem>
            ))}
          </CardGrid>
        )}
      </CardGridContainer>
    </>
  );
}
