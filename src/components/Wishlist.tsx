import { useEffect, useMemo, useReducer } from 'react';
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

const WishlistTitle = styled(CardGridTitle)<{ $isMobile?: boolean }>`
  font-size: 2.2rem;
  margin: 0;
  text-align: ${(props) => (props.$isMobile ? 'center' : 'left')};
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

type WishlistState = {
  localWishlist: StoredCard[];
  loadedSharedCards: StoredCard[];
  loadingShared: boolean;
  isMobile: boolean;
  selectedCard: StoredCard | null;
  hoveredCardId: string | null;
  copied: boolean;
  loadedImages: Set<string>;
};

type WishlistAction =
  | { type: 'SET_LOCAL_WISHLIST'; payload: StoredCard[] }
  | { type: 'SET_LOADED_SHARED_CARDS'; payload: StoredCard[] }
  | { type: 'SET_LOADING_SHARED'; payload: boolean }
  | { type: 'SET_IS_MOBILE'; payload: boolean }
  | { type: 'SET_SELECTED_CARD'; payload: StoredCard | null }
  | { type: 'SET_HOVERED_CARD'; payload: string | null }
  | { type: 'SET_COPIED'; payload: boolean }
  | { type: 'ADD_LOADED_IMAGE'; payload: string }
  | { type: 'REMOVE_CARD'; payload: string }
  | { type: 'UPDATE_SELECTED_CARD' };

function wishlistReducer(
  state: WishlistState,
  action: WishlistAction,
): WishlistState {
  switch (action.type) {
    case 'SET_LOCAL_WISHLIST':
      return { ...state, localWishlist: action.payload };
    case 'SET_LOADED_SHARED_CARDS':
      return { ...state, loadedSharedCards: action.payload };
    case 'SET_LOADING_SHARED':
      return { ...state, loadingShared: action.payload };
    case 'SET_IS_MOBILE':
      return { ...state, isMobile: action.payload };
    case 'SET_SELECTED_CARD':
      return { ...state, selectedCard: action.payload };
    case 'SET_HOVERED_CARD':
      return { ...state, hoveredCardId: action.payload };
    case 'SET_COPIED':
      return { ...state, copied: action.payload };
    case 'ADD_LOADED_IMAGE':
      return {
        ...state,
        loadedImages: new Set([...state.loadedImages, action.payload]),
      };
    case 'REMOVE_CARD':
      const newLocalWishlist = state.localWishlist.filter(
        (card) => card.id !== action.payload,
      );
      const newSelectedCard =
        state.selectedCard?.id === action.payload ? null : state.selectedCard;
      return {
        ...state,
        localWishlist: newLocalWishlist,
        selectedCard: newSelectedCard,
      };
    case 'UPDATE_SELECTED_CARD':
      return state.selectedCard
        ? {
            ...state,
            selectedCard: { ...state.selectedCard },
          }
        : state;
    default:
      return state;
  }
}

export function Wishlist({ sharedCards, ownerName }: WishlistProps) {
  const isViewingShared = sharedCards !== undefined && sharedCards !== null;

  const [state, dispatch] = useReducer(wishlistReducer, {
    localWishlist: storageService.getWishlist(),
    loadedSharedCards: [],
    loadingShared: false,
    isMobile: false,
    selectedCard: null,
    hoveredCardId: null,
    copied: false,
    loadedImages: new Set<string>(),
  });

  // Detect mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      dispatch({ type: 'SET_IS_MOBILE', payload: window.innerWidth < 800 });
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Fetch full card details for shared wishlist
  useEffect(() => {
    if (isViewingShared && sharedCards && sharedCards.length > 0) {
      const fetchCardDetails = async () => {
        dispatch({ type: 'SET_LOADING_SHARED', payload: true });
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
          dispatch({ type: 'SET_LOADED_SHARED_CARDS', payload: detailedCards });
        } catch (err) {
          console.error('Failed to load shared cards:', err);
        } finally {
          dispatch({ type: 'SET_LOADING_SHARED', payload: false });
        }
      };

      fetchCardDetails();
    }
  }, [isViewingShared, sharedCards]);

  // Use memoized value for cards based on viewing mode
  const cards = useMemo(() => {
    return isViewingShared ? state.loadedSharedCards : state.localWishlist;
  }, [isViewingShared, state.loadedSharedCards, state.localWishlist]);

  const handleRemove = (cardId: string) => {
    if (isViewingShared) return; // Can't remove from shared wishlist
    storageService.removeFromWishlist(cardId);
    dispatch({ type: 'REMOVE_CARD', payload: cardId });
  };

  const handleToggleCollection = () => {
    if (!state.selectedCard) return;

    const collection = storageService.getCollection();
    const inCollection = collection.some(
      (c) => c.id === state.selectedCard!.id,
    );

    if (inCollection) {
      storageService.removeFromCollection(state.selectedCard.id);
    } else {
      storageService.addToCollection(state.selectedCard);
    }
    // Force re-render by creating new card object
    dispatch({ type: 'UPDATE_SELECTED_CARD' });
  };

  const handleToggleWishlist = () => {
    if (!state.selectedCard || isViewingShared) return;

    handleRemove(state.selectedCard.id);
  };

  const handleShare = async () => {
    if (isViewingShared) return;

    const encoded = storageService.encodeWishlistForSharing();
    const shareUrl = `${window.location.origin}${window.location.pathname}?wishlist=${encoded}`;

    try {
      await navigator.clipboard.writeText(shareUrl);
      dispatch({ type: 'SET_COPIED', payload: true });
      setTimeout(() => dispatch({ type: 'SET_COPIED', payload: false }), 2000);
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
        dispatch({ type: 'SET_SELECTED_CARD', payload: null });
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, []);

  return (
    <>
      <CardModal
        card={state.selectedCard}
        onClose={() => dispatch({ type: 'SET_SELECTED_CARD', payload: null })}
        inCollection={
          state.selectedCard
            ? storageService
                .getCollection()
                .some((c) => c.id === state.selectedCard!.id)
            : false
        }
        inWishlist={
          isViewingShared
            ? false
            : state.selectedCard
              ? storageService
                  .getWishlist()
                  .some((c) => c.id === state.selectedCard!.id)
              : false
        }
        onToggleCollection={
          state.selectedCard ? handleToggleCollection : undefined
        }
        onToggleWishlist={
          state.selectedCard && !isViewingShared
            ? handleToggleWishlist
            : undefined
        }
      />
      <CardGridContainer>
        <HeaderContainer $isMobile={state.isMobile}>
          <WishlistTitle $isMobile={state.isMobile}>
            {isViewingShared
              ? `${ownerName ? ownerName + "'s" : 'Shared'} Wishlist (${
                  cards.length
                } cards)`
              : `My Wishlist (${cards.length} cards)`}
            {state.loadingShared && <LoadingSpan>Loading cards...</LoadingSpan>}
          </WishlistTitle>

          {!isViewingShared && cards.length > 0 && (
            <ShareButton
              onClick={handleShare}
              $isMobile={state.isMobile}
              $copied={state.copied}
            >
              {state.copied ? (
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
                onMouseEnter={() =>
                  dispatch({ type: 'SET_HOVERED_CARD', payload: card.id })
                }
                onMouseLeave={() =>
                  dispatch({ type: 'SET_HOVERED_CARD', payload: null })
                }
              >
                <CardImageContainer>
                  {!state.loadedImages.has(card.id) && <CardImagePlaceholder />}
                  <CardImage
                    src={card.image}
                    alt={card.name}
                    loading='lazy'
                    $loaded={state.loadedImages.has(card.id)}
                    onClick={() =>
                      dispatch({ type: 'SET_SELECTED_CARD', payload: card })
                    }
                    onLoad={() => {
                      dispatch({ type: 'ADD_LOADED_IMAGE', payload: card.id });
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
                    $isMobile={state.isMobile}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#cc0000';
                      if (!state.isMobile) {
                        e.currentTarget.style.transform = 'scale(1.1)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor =
                        'rgba(255, 68, 68, 0.9)';
                      if (!state.isMobile) {
                        e.currentTarget.style.transform = 'scale(1)';
                      }
                    }}
                    title='Remove from wishlist'
                  >
                    <X size={16} strokeWidth={2} />
                    {state.isMobile && <span>Remove</span>}
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
