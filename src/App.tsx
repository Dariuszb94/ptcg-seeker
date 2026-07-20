import { useState, useEffect } from 'react';
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

function App() {
  const [currentView, setCurrentView] = useState<View>('home');
  const [selectedSet, setSelectedSet] = useState('');
  const { sets, loading, error } = usePokemonSets();
  const [searchInput, setSearchInput] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [sharedWishlist, setSharedWishlist] = useState<StoredCard[] | null>(
    null,
  );

  // Check for shared wishlist in URL on mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const wishlistParam = urlParams.get('wishlist');

    if (wishlistParam) {
      const decoded = storageService.decodeSharedWishlist(wishlistParam);
      if (decoded.length > 0) {
        setSharedWishlist(decoded);
        setCurrentView('wishlist');
      }
    }
  }, []);

  // Filter sets based on search input
  const filteredSets = sets.filter((set) => {
    const searchTerm = searchInput.toLowerCase();
    return (
      set.name.toLowerCase().includes(searchTerm) ||
      set.id.toLowerCase().includes(searchTerm) ||
      set.serie?.name.toLowerCase().includes(searchTerm) ||
      set.releaseDate?.includes(searchTerm)
    );
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchInput(value);
    setShowSuggestions(true);
    if (!value) {
      setSelectedSet('');
    }
  };

  const handleSelectSet = (set: PokemonSet) => {
    setSelectedSet(set.id);
    setSearchInput(set.name);
    setShowSuggestions(false);
  };

  const handleInputFocus = () => {
    setShowSuggestions(true);
  };

  const handleInputBlur = () => {
    // Delay hiding to allow click on suggestion
    setTimeout(() => setShowSuggestions(false), 200);
  };

  const handleNavigate = (view: View) => {
    setCurrentView(view);
    // Clear shared wishlist when navigating away from shared view
    if (view !== 'wishlist') {
      setSharedWishlist(null);
      // Clear URL params
      window.history.replaceState({}, '', window.location.pathname);
    }
  };

  // Render different views based on currentView
  if (currentView === 'collection') {
    return (
      <>
        <Header onNavigate={handleNavigate} currentView={currentView} />
        <main id='main-content'>
          <Collection />
        </main>
      </>
    );
  }

  if (currentView === 'wishlist') {
    return (
      <>
        <Header onNavigate={handleNavigate} currentView={currentView} />
        <main id='main-content'>
          <Wishlist sharedCards={sharedWishlist} ownerName='Friend' />
        </main>
      </>
    );
  }

  return (
    <>
      <Header onNavigate={handleNavigate} currentView={currentView} />

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
                  value={searchInput}
                  onChange={handleInputChange}
                  onFocus={handleInputFocus}
                  onBlur={handleInputBlur}
                  placeholder='Search for a Pokemon TCG set...'
                  role='combobox'
                  aria-expanded={showSuggestions && filteredSets.length > 0}
                  aria-controls='set-suggestions'
                  aria-autocomplete='list'
                  aria-label='Search for Pokemon TCG sets by name or series'
                />
                {showSuggestions && filteredSets.length > 0 && (
                  <SuggestionsDropdown
                    id='set-suggestions'
                    role='listbox'
                    aria-label='Pokemon TCG set suggestions'
                  >
                    {filteredSets.slice(0, 10).map((set) => (
                      <SuggestionItem
                        key={set.id}
                        role='option'
                        aria-selected={selectedSet === set.id}
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

          {selectedSet && (
            <SelectedSetContainer>
              {(() => {
                const set = sets.find((s) => s.id === selectedSet);
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

                    <CardGrid setId={selectedSet} setName={set.name} />
                  </>
                );
              })()}
            </SelectedSetContainer>
          )}
        </Container>

        {/* Show Hero Section when no set is selected */}
        {!selectedSet && <HeroSection />}
      </main>
    </>
  );
}

export default App;
