import { useState, useEffect, useMemo, useReducer } from 'react';
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

type CollectionState = {
  cards: StoredCard[];
  selectedCard: StoredCard | null;
  hoveredCardId: string | null;
  isMobile: boolean;
  loadedImages: Set<string>;
};

type CollectionAction =
  | { type: 'SET_CARDS'; payload: StoredCard[] }
  | { type: 'SET_SELECTED_CARD'; payload: StoredCard | null }
  | { type: 'SET_HOVERED_CARD'; payload: string | null }
  | { type: 'SET_IS_MOBILE'; payload: boolean }
  | { type: 'ADD_LOADED_IMAGE'; payload: string }
  | { type: 'REMOVE_CARD'; payload: string };

function collectionReducer(
  state: CollectionState,
  action: CollectionAction,
): CollectionState {
  switch (action.type) {
    case 'SET_CARDS':
      return { ...state, cards: action.payload };
    case 'SET_SELECTED_CARD':
      return { ...state, selectedCard: action.payload };
    case 'SET_HOVERED_CARD':
      return { ...state, hoveredCardId: action.payload };
    case 'SET_IS_MOBILE':
      return { ...state, isMobile: action.payload };
    case 'ADD_LOADED_IMAGE':
      return {
        ...state,
        loadedImages: new Set([...state.loadedImages, action.payload]),
      };
    case 'REMOVE_CARD':
      const newCards = state.cards.filter((card) => card.id !== action.payload);
      const newSelectedCard =
        state.selectedCard?.id === action.payload ? null : state.selectedCard;
      return {
        ...state,
        cards: newCards,
        selectedCard: newSelectedCard,
      };
    default:
      return state;
  }
}

export function Collection() {
  const [state, dispatch] = useReducer(collectionReducer, {
    cards: storageService.getCollection(),
    selectedCard: null,
    hoveredCardId: null,
    isMobile: false,
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

  const loadCards = () => {
    const collection = storageService.getCollection();
    dispatch({ type: 'SET_CARDS', payload: collection });
  };

  // Sort cards by set name, then by local ID
  const sortedCards = useMemo(() => {
    return [...state.cards].sort((a, b) => {
      // Sort by set name first
      const setCompare = (a.setName || '').localeCompare(b.setName || '');
      if (setCompare !== 0) return setCompare;
      // Then by local ID within the same set
      return (a.localId || '').localeCompare(b.localId || '', undefined, {
        numeric: true,
      });
    });
  }, [state.cards]);

  const handleRemove = (cardId: string) => {
    storageService.removeFromCollection(cardId);
    dispatch({ type: 'REMOVE_CARD', payload: cardId });
  };

  const handleToggleWishlist = () => {
    if (!state.selectedCard) return;

    const wishlist = storageService.getWishlist();
    const inWishlist = wishlist.some((c) => c.id === state.selectedCard!.id);

    if (inWishlist) {
      storageService.removeFromWishlist(state.selectedCard.id);
    } else {
      storageService.addToWishlist(state.selectedCard);
    }
    // Force re-render by creating new card object
    dispatch({ type: 'SET_SELECTED_CARD', payload: { ...state.selectedCard } });
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
        inCollection={true}
        inWishlist={
          state.selectedCard
            ? storageService
                .getWishlist()
                .some((c) => c.id === state.selectedCard!.id)
            : false
        }
        onToggleCollection={
          state.selectedCard
            ? () => handleRemove(state.selectedCard!.id)
            : undefined
        }
        onToggleWishlist={state.selectedCard ? handleToggleWishlist : undefined}
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
                <RemoveButton
                  className='remove-button'
                  onClick={() => handleRemove(card.id)}
                  $isMobile={state.isMobile}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#cc0000';
                    if (!isMobile) {
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
                  title='Remove from collection'
                >
                  <X size={16} strokeWidth={2} />
                  {state.isMobile && <span>Remove</span>}
                </RemoveButton>
              </CardItem>
            ))}
          </CardGrid>
        )}
      </CardGridContainer>
    </>
  );
}
