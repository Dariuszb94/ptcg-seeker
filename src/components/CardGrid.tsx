import { useEffect, useReducer } from 'react';
import { pokemonTcgApi, formatImageUrl } from '../services/pokemon-tcg-api';
import { storageService, type StoredCard } from '../services/storage';
import { Heart, Plus, Check, Star } from 'lucide-react';
import {
  CardGridContainer,
  CardGridTitle,
  CardGrid as StyledCardGrid,
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

type CardGridState = {
  cards: CardSummary[];
  loading: boolean;
  error: string | null;
  collectionIds: Set<string>;
  wishlistIds: Set<string>;
  selectedCard: CardSummary | null;
  hoveredCardId: string | null;
  isMobile: boolean;
  loadedImages: Set<string>;
};

type CardGridAction =
  | { type: 'SET_CARDS'; payload: CardSummary[] }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SET_COLLECTION_IDS'; payload: Set<string> }
  | { type: 'SET_WISHLIST_IDS'; payload: Set<string> }
  | { type: 'SET_SELECTED_CARD'; payload: CardSummary | null }
  | { type: 'SET_HOVERED_CARD'; payload: string | null }
  | { type: 'SET_IS_MOBILE'; payload: boolean }
  | { type: 'ADD_LOADED_IMAGE'; payload: string }
  | { type: 'ADD_TO_COLLECTION'; payload: string }
  | { type: 'REMOVE_FROM_COLLECTION'; payload: string }
  | { type: 'ADD_TO_WISHLIST'; payload: string }
  | { type: 'REMOVE_FROM_WISHLIST'; payload: string }
  | { type: 'LOAD_CARDS_START' }
  | { type: 'LOAD_CARDS_SUCCESS'; payload: CardSummary[] }
  | { type: 'LOAD_CARDS_ERROR'; payload: string };

function cardGridReducer(
  state: CardGridState,
  action: CardGridAction,
): CardGridState {
  switch (action.type) {
    case 'SET_CARDS':
      return { ...state, cards: action.payload };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'SET_COLLECTION_IDS':
      return { ...state, collectionIds: action.payload };
    case 'SET_WISHLIST_IDS':
      return { ...state, wishlistIds: action.payload };
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
    case 'ADD_TO_COLLECTION':
      return {
        ...state,
        collectionIds: new Set([...state.collectionIds, action.payload]),
      };
    case 'REMOVE_FROM_COLLECTION': {
      const newIds = new Set(state.collectionIds);
      newIds.delete(action.payload);
      return { ...state, collectionIds: newIds };
    }
    case 'ADD_TO_WISHLIST':
      return {
        ...state,
        wishlistIds: new Set([...state.wishlistIds, action.payload]),
      };
    case 'REMOVE_FROM_WISHLIST': {
      const newIds = new Set(state.wishlistIds);
      newIds.delete(action.payload);
      return { ...state, wishlistIds: newIds };
    }
    case 'LOAD_CARDS_START':
      return { ...state, loading: true, error: null };
    case 'LOAD_CARDS_SUCCESS':
      return { ...state, loading: false, cards: action.payload };
    case 'LOAD_CARDS_ERROR':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
}

export function CardGrid({ setId, setName }: CardGridProps) {
  const [state, dispatch] = useReducer(cardGridReducer, {
    cards: [],
    loading: false,
    error: null,
    collectionIds: new Set<string>(),
    wishlistIds: new Set<string>(),
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

  // Load collection and wishlist IDs
  useEffect(() => {
    const collection = storageService.getCollection();
    const wishlist = storageService.getWishlist();
    dispatch({
      type: 'SET_COLLECTION_IDS',
      payload: new Set(collection.map((c) => c.id)),
    });
    dispatch({
      type: 'SET_WISHLIST_IDS',
      payload: new Set(wishlist.map((c) => c.id)),
    });
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
    dispatch({ type: 'ADD_TO_COLLECTION', payload: card.id });
  };

  const handleRemoveFromCollection = (cardId: string) => {
    storageService.removeFromCollection(cardId);
    dispatch({ type: 'REMOVE_FROM_COLLECTION', payload: cardId });
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
    dispatch({ type: 'ADD_TO_WISHLIST', payload: card.id });
  };

  const handleRemoveFromWishlist = (cardId: string) => {
    storageService.removeFromWishlist(cardId);
    dispatch({ type: 'REMOVE_FROM_WISHLIST', payload: cardId });
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

  // Load cards automatically when setId changes
  useEffect(() => {
    const loadCards = async () => {
      try {
        dispatch({ type: 'LOAD_CARDS_START' });
        const cardsData = await pokemonTcgApi.getCardsFromSet(setId);
        const cardSummaries = cardsData.map((card) => ({
          id: card.id,
          localId: card.localId,
          name: card.name,
          image: formatImageUrl(card.image, 'low', 'webp'),
        }));
        dispatch({ type: 'LOAD_CARDS_SUCCESS', payload: cardSummaries });
      } catch (err) {
        const errorMsg =
          err instanceof Error ? err.message : 'Failed to fetch cards';
        dispatch({ type: 'LOAD_CARDS_ERROR', payload: errorMsg });
        console.error('Error fetching cards:', err);
      }
    };

    loadCards();
  }, [setId]);

  if (state.loading) {
    return <LoadingText>Loading cards...</LoadingText>;
  }

  if (state.error) {
    return (
      <ErrorBox>
        <p>Error: {state.error}</p>
      </ErrorBox>
    );
  }

  return (
    <>
      <CardModal
        card={state.selectedCard}
        onClose={() => dispatch({ type: 'SET_SELECTED_CARD', payload: null })}
        inCollection={
          state.selectedCard
            ? state.collectionIds.has(state.selectedCard.id)
            : false
        }
        inWishlist={
          state.selectedCard
            ? state.wishlistIds.has(state.selectedCard.id)
            : false
        }
        onToggleCollection={
          state.selectedCard
            ? () => {
                if (state.collectionIds.has(state.selectedCard!.id)) {
                  handleRemoveFromCollection(state.selectedCard!.id);
                } else {
                  handleAddToCollection(state.selectedCard!);
                }
              }
            : undefined
        }
        onToggleWishlist={
          state.selectedCard
            ? () => {
                if (state.wishlistIds.has(state.selectedCard!.id)) {
                  handleRemoveFromWishlist(state.selectedCard!.id);
                } else {
                  handleAddToWishlist(state.selectedCard!);
                }
              }
            : undefined
        }
      />
      <CardGridContainer>
        <CardGridTitle>Cards in this Set ({state.cards.length})</CardGridTitle>
        <StyledCardGrid>
          {state.cards.map((card) => {
            const inCollection = state.collectionIds.has(card.id);
            const inWishlist = state.wishlistIds.has(card.id);

            return (
              <CardItem
                key={card.id}
                onMouseEnter={() =>
                  dispatch({ type: 'SET_HOVERED_CARD', payload: card.id })
                }
                onMouseLeave={() =>
                  dispatch({ type: 'SET_HOVERED_CARD', payload: null })
                }
              >
                <ButtonContainer
                  className='card-buttons'
                  $isMobile={state.isMobile}
                  style={{
                    opacity: state.isMobile
                      ? 1
                      : state.hoveredCardId === card.id
                        ? 1
                        : 0,
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
                    $isMobile={state.isMobile}
                    title={
                      inCollection
                        ? 'Remove from collection'
                        : 'Add to collection'
                    }
                  >
                    {inCollection ? (
                      <Check size={state.isMobile ? 20 : 24} />
                    ) : (
                      <Plus size={state.isMobile ? 20 : 24} />
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
                    $isMobile={state.isMobile}
                    title={
                      inWishlist ? 'Remove from wishlist' : 'Add to wishlist'
                    }
                  >
                    {inWishlist ? (
                      <Star
                        size={state.isMobile ? 20 : 24}
                        fill='currentColor'
                      />
                    ) : (
                      <Heart size={state.isMobile ? 20 : 24} />
                    )}
                  </ActionButton>
                </ButtonContainer>

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
              </CardItem>
            );
          })}
        </StyledCardGrid>
      </CardGridContainer>
    </>
  );
}
