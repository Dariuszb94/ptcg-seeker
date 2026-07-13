import { useState, useEffect, useMemo } from 'react';
import styled from 'styled-components';
import { storageService, type StoredCard } from '../services/storage';
import { pokemonTcgApi, formatImageUrl } from '../services/pokemon-tcg-api';
import { X, Share2, Check } from 'lucide-react';
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

// Local styled components specific to Wishlist
const HeaderContainer = styled.div<{ $isMobile?: boolean }>`
  display: flex;
  flex-direction: ${(props) => (props.$isMobile ? 'column' : 'row')};
  justify-content: space-between;
  align-items: ${(props) => (props.$isMobile ? 'stretch' : 'center')};
  margin-bottom: 1.5rem;
  gap: ${(props) => (props.$isMobile ? '1rem' : 0)};
`;

const WishlistTitle = styled(CardGridTitle)`
  font-size: 2.2rem;
  margin: 0;
  text-align: ${(props: { $isMobile?: boolean }) =>
    props.$isMobile ? 'center' : 'left'};
`;

const LoadingSpan = styled.span`
  font-size: 1rem;
  color: #a0a0c0;
  margin-left: 1rem;
`;

const ShareButton = styled.button<{ $isMobile?: boolean; $copied?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background-color: ${(props) => (props.$copied ? '#10b981' : '#3b82f6')};
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 500;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3);
  width: ${(props) => (props.$isMobile ? '100%' : 'auto')};

  &:hover {
    background-color: ${(props) => (props.$copied ? '#10b981' : '#2563eb')};
    transform: ${(props) => (props.$copied ? 'none' : 'translateY(-2px)')};
    box-shadow: ${(props) =>
      props.$copied
        ? '0 2px 8px rgba(59, 130, 246, 0.3)'
        : '0 4px 12px rgba(59, 130, 246, 0.4)'};
  }
`;

const WarningBanner = styled.div`
  background-color: #fff3cd;
  border: 1px solid #ffc107;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1.5rem;
  font-size: 0.95rem;
  color: #856404;

  strong {
    display: block;
  }

  p {
    margin: 0.5rem 0 0 0;
  }
`;

interface WishlistProps {
  sharedCards?: StoredCard[] | null;
  ownerName?: string;
}

export function Wishlist({ sharedCards, ownerName }: WishlistProps) {
  const isViewingShared = sharedCards !== undefined && sharedCards !== null;

  const [localWishlist, setLocalWishlist] = useState<StoredCard[]>(() =>
    storageService.getWishlist(),
  );

  const [loadedSharedCards, setLoadedSharedCards] = useState<StoredCard[]>([]);
  const [loadingShared, setLoadingShared] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 800);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Fetch full card details for shared wishlist
  useEffect(() => {
    if (isViewingShared && sharedCards && sharedCards.length > 0) {
      const fetchCardDetails = async () => {
        setLoadingShared(true);
        try {
          const detailedCards = await Promise.all(
            sharedCards.map(async (card) => {
              // If card already has full data, return it
              if (card.name !== 'Loading...' && card.image) {
                return card;
              }

              // Otherwise fetch from API
              try {
                const fullCard = await pokemonTcgApi.getCard(card.id);
                return {
                  id: fullCard.id,
                  localId: fullCard.localId,
                  name: fullCard.name,
                  image: formatImageUrl(fullCard.image, 'high'),
                  setId: fullCard.set.id,
                  setName: fullCard.set.name,
                  addedAt: card.addedAt,
                };
              } catch (err) {
                console.error(`Failed to fetch card ${card.id}:`, err);
                return card; // Return partial data if fetch fails
              }
            }),
          );
          setLoadedSharedCards(detailedCards);
        } catch (err) {
          console.error('Failed to load shared cards:', err);
        } finally {
          setLoadingShared(false);
        }
      };

      fetchCardDetails();
    }
  }, [isViewingShared, sharedCards]);

  // Use memoized value for cards based on viewing mode
  const cards = useMemo(() => {
    return isViewingShared ? loadedSharedCards : localWishlist;
  }, [isViewingShared, loadedSharedCards, localWishlist]);

  const [selectedCard, setSelectedCard] = useState<StoredCard | null>(null);
  const [hoveredCardId, setHoveredCardId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());

  const handleRemove = (cardId: string) => {
    if (isViewingShared) return; // Can't remove from shared wishlist
    storageService.removeFromWishlist(cardId);
    const wishlist = storageService.getWishlist();
    setLocalWishlist(wishlist);
    // Close modal if the removed card is currently selected
    if (selectedCard && selectedCard.id === cardId) {
      setSelectedCard(null);
    }
  };

  const handleToggleCollection = () => {
    if (!selectedCard) return;

    const collection = storageService.getCollection();
    const inCollection = collection.some((c) => c.id === selectedCard.id);

    if (inCollection) {
      storageService.removeFromCollection(selectedCard.id);
    } else {
      storageService.addToCollection(selectedCard);
    }
    // Force re-render by creating new card object
    setSelectedCard({ ...selectedCard });
  };

  const handleToggleWishlist = () => {
    if (!selectedCard || isViewingShared) return;

    handleRemove(selectedCard.id);
  };

  const handleShare = async () => {
    if (isViewingShared) return;

    const encoded = storageService.encodeWishlistForSharing();
    const shareUrl = `${window.location.origin}${window.location.pathname}?wishlist=${encoded}`;

    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
      // Fallback: show the URL in a prompt
      prompt('Copy this link to share your wishlist:', shareUrl);
    }
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
        inCollection={
          selectedCard
            ? storageService
                .getCollection()
                .some((c) => c.id === selectedCard.id)
            : false
        }
        inWishlist={
          isViewingShared
            ? false
            : selectedCard
              ? storageService
                  .getWishlist()
                  .some((c) => c.id === selectedCard.id)
              : false
        }
        onToggleCollection={selectedCard ? handleToggleCollection : undefined}
        onToggleWishlist={
          selectedCard && !isViewingShared ? handleToggleWishlist : undefined
        }
      />
      <CardGridContainer>
        <HeaderContainer $isMobile={isMobile}>
          <WishlistTitle $isMobile={isMobile}>
            {isViewingShared
              ? `${ownerName ? ownerName + "'s" : 'Shared'} Wishlist (${
                  cards.length
                } cards)`
              : `My Wishlist (${cards.length} cards)`}
            {loadingShared && <LoadingSpan>Loading cards...</LoadingSpan>}
          </WishlistTitle>

          {!isViewingShared && cards.length > 0 && (
            <ShareButton
              onClick={handleShare}
              $isMobile={isMobile}
              $copied={copied}
            >
              {copied ? (
                <>
                  <Check size={20} />
                  Link Copied!
                </>
              ) : (
                <>
                  <Share2 size={20} />
                  Share Wishlist
                </>
              )}
            </ShareButton>
          )}
        </HeaderContainer>

        {isViewingShared && (
          <WarningBanner>
            <strong>👀 Viewing a shared wishlist</strong>
            <p>
              You can add these cards to your own collection or wishlist. Your
              changes won't affect the shared wishlist.
            </p>
          </WarningBanner>
        )}

        {cards.length === 0 ? (
          <EmptyState>
            <p>
              {isViewingShared
                ? 'This wishlist is empty.'
                : 'Your wishlist is empty. Start adding cards you want to collect!'}
            </p>
          </EmptyState>
        ) : (
          <CardGrid>
            {cards.map((card) => (
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
                {!isViewingShared && (
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
                    title='Remove from wishlist'
                  >
                    <X size={16} strokeWidth={2} />
                    {isMobile && <span>Remove</span>}
                  </RemoveButton>
                )}
              </CardItem>
            ))}
          </CardGrid>
        )}
      </CardGridContainer>
    </>
  );
}
