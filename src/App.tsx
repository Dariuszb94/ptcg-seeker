import { useEffect, useReducer } from 'react';
import { formatAssetUrl } from './services/pokemon-tcg-api';
import type { PokemonSet } from './types/pokemon-tcg';
import { CardGrid } from './components/CardGrid';
import { Header } from './components/Header';
import { Collection } from './components/Collection';
import { Wishlist } from './components/Wishlist';
import { HeroSection } from './components/HeroSection';
import { storageService, type StoredCard } from './services/storage';
import { usePokemonSets } from './hooks/usePokemonSets';
import {
  Container,
  SearchSection,
  Label,
  LoadingText,
  ErrorBox,
  SearchWrapper,
  SearchInput,
  SuggestionsDropdown,
  SuggestionItem,
  SuggestionTitle,
  SuggestionMeta,
  SelectedSetContainer,
  SetImagesContainer,
  SetLogo,
  SetSymbol,
} from './styles/App.styled';

type View = 'home' | 'collection' | 'wishlist';

type AppState = {
  currentView: View;
  selectedSet: string;
  searchInput: string;
  showSuggestions: boolean;
  sharedWishlist: StoredCard[] | null;
};

type AppAction =
  | { type: 'SET_VIEW'; payload: View }
  | { type: 'SET_SELECTED_SET'; payload: string }
  | { type: 'SET_SEARCH_INPUT'; payload: string }
  | { type: 'SET_SHOW_SUGGESTIONS'; payload: boolean }
  | { type: 'SET_SHARED_WISHLIST'; payload: StoredCard[] | null }
  | { type: 'SELECT_SET'; payload: { set: PokemonSet } }
  | { type: 'NAVIGATE'; payload: View }
  | { type: 'CLEAR_SEARCH' };

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_VIEW':
      return { ...state, currentView: action.payload };
    case 'SET_SELECTED_SET':
      return { ...state, selectedSet: action.payload };
    case 'SET_SEARCH_INPUT':
      return {
        ...state,
        searchInput: action.payload,
        showSuggestions: true,
        selectedSet: action.payload ? state.selectedSet : '',
      };
    case 'SET_SHOW_SUGGESTIONS':
      return { ...state, showSuggestions: action.payload };
    case 'SET_SHARED_WISHLIST':
      return { ...state, sharedWishlist: action.payload };
    case 'SELECT_SET':
      return {
        ...state,
        selectedSet: action.payload.set.id,
        searchInput: action.payload.set.name,
        showSuggestions: false,
      };
    case 'NAVIGATE':
      return {
        ...state,
        currentView: action.payload,
        sharedWishlist:
          action.payload !== 'wishlist' ? null : state.sharedWishlist,
      };
    case 'CLEAR_SEARCH':
      return {
        ...state,
        searchInput: '',
        selectedSet: '',
        showSuggestions: false,
      };
    default:
      return state;
  }
}

function App() {
  const [state, dispatch] = useReducer(appReducer, {
    currentView: 'home',
    selectedSet: '',
    searchInput: '',
    showSuggestions: false,
    sharedWishlist: null,
  });
  const { sets, loading, error } = usePokemonSets();

  // Check for shared wishlist in URL on mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const wishlistParam = urlParams.get('wishlist');

    if (wishlistParam) {
      const decoded = storageService.decodeSharedWishlist(wishlistParam);
      if (decoded.length > 0) {
        dispatch({ type: 'SET_SHARED_WISHLIST', payload: decoded });
        dispatch({ type: 'SET_VIEW', payload: 'wishlist' });
      }
    }
  }, []);

  // Filter sets based on search input
  const filteredSets = sets.filter((set) => {
    const searchTerm = state.searchInput.toLowerCase();
    return (
      set.name.toLowerCase().includes(searchTerm) ||
      set.id.toLowerCase().includes(searchTerm) ||
      set.serie?.name.toLowerCase().includes(searchTerm) ||
      set.releaseDate?.includes(searchTerm)
    );
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({ type: 'SET_SEARCH_INPUT', payload: e.target.value });
  };

  const handleSelectSet = (set: PokemonSet) => {
    dispatch({ type: 'SELECT_SET', payload: { set } });
  };

  const handleInputFocus = () => {
    dispatch({ type: 'SET_SHOW_SUGGESTIONS', payload: true });
  };

  const handleInputBlur = () => {
    // Delay hiding to allow click on suggestion
    setTimeout(
      () => dispatch({ type: 'SET_SHOW_SUGGESTIONS', payload: false }),
      200,
    );
  };

  const handleNavigate = (view: View) => {
    dispatch({ type: 'NAVIGATE', payload: view });
    // Clear URL params when navigating away from wishlist
    if (view !== 'wishlist') {
      window.history.replaceState({}, '', window.location.pathname);
    }
  };

  // Render different views based on currentView
  if (state.currentView === 'collection') {
    return (
      <>
        <Header onNavigate={handleNavigate} currentView={state.currentView} />
        <main id='main-content'>
          <Collection />
        </main>
      </>
    );
  }

  if (state.currentView === 'wishlist') {
    return (
      <>
        <Header onNavigate={handleNavigate} currentView={state.currentView} />
        <main id='main-content'>
          <Wishlist sharedCards={state.sharedWishlist} ownerName='Friend' />
        </main>
      </>
    );
  }

  return (
    <>
      <Header onNavigate={handleNavigate} currentView={state.currentView} />

      <main id='main-content'>
        <Container>
          <SearchSection>
            <Label htmlFor='set-select'>Select a Pokemon TCG Set</Label>

            {loading && <LoadingText>Loading sets...</LoadingText>}

            {error && (
              <ErrorBox>
                <p>Error: {error}</p>
              </ErrorBox>
            )}

            {!loading && !error && (
              <SearchWrapper>
                <SearchInput
                  id='set-select'
                  type='text'
                  value={state.searchInput}
                  onChange={handleInputChange}
                  onFocus={handleInputFocus}
                  onBlur={handleInputBlur}
                  placeholder='Search for a Pokemon TCG set...'
                  role='combobox'
                  aria-expanded={
                    state.showSuggestions && filteredSets.length > 0
                  }
                  aria-controls='set-suggestions'
                  aria-autocomplete='list'
                  aria-label='Search for Pokemon TCG sets by name or series'
                />
                {state.showSuggestions && filteredSets.length > 0 && (
                  <SuggestionsDropdown
                    id='set-suggestions'
                    role='listbox'
                    aria-label='Pokemon TCG set suggestions'
                  >
                    {filteredSets.slice(0, 10).map((set) => (
                      <SuggestionItem
                        key={set.id}
                        role='option'
                        aria-selected={state.selectedSet === set.id}
                        tabIndex={0}
                        onClick={() => handleSelectSet(set)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            handleSelectSet(set);
                          }
                        }}
                      >
                        <SuggestionTitle>{set.name}</SuggestionTitle>
                        <SuggestionMeta>
                          {set.releaseDate
                            ? `${set.releaseDate.split('-')[0]}`
                            : ''}{' '}
                          {set.serie?.name ? `• ${set.serie.name}` : ''}
                        </SuggestionMeta>
                      </SuggestionItem>
                    ))}
                  </SuggestionsDropdown>
                )}
              </SearchWrapper>
            )}
          </SearchSection>

          {state.selectedSet && (
            <SelectedSetContainer>
              {(() => {
                const set = sets.find((s) => s.id === state.selectedSet);
                if (!set) return null;
                console.log({ set });
                return (
                  <>
                    <SetImagesContainer>
                      {set.logo && (
                        <SetLogo
                          src={formatAssetUrl(set.logo, 'webp')}
                          alt={`${set.name} logo`}
                          loading='lazy'
                          onError={(e) => {
                            const img = e.target as HTMLImageElement;
                            if (img.src.endsWith('.webp')) {
                              img.src = formatAssetUrl(set.logo, 'png');
                            }
                          }}
                        />
                      )}
                      {set.symbol && (
                        <SetSymbol
                          src={formatAssetUrl(set.symbol, 'webp')}
                          alt={`${set.name} symbol`}
                          loading='lazy'
                          onError={(e) => {
                            const img = e.target as HTMLImageElement;
                            if (img.src.endsWith('.webp')) {
                              img.src = formatAssetUrl(set.symbol, 'png');
                            }
                          }}
                        />
                      )}
                    </SetImagesContainer>

                    <CardGrid setId={state.selectedSet} setName={set.name} />
                  </>
                );
              })()}
            </SelectedSetContainer>
          )}
        </Container>

        {/* Show Hero Section when no set is selected */}
        {!state.selectedSet && <HeroSection />}
      </main>
    </>
  );
}

export default App;
