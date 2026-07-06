import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { pokemonTcgApi, formatAssetUrl } from './services/pokemon-tcg-api';
import type { PokemonSet } from './types/pokemon-tcg';
import { CardGrid } from './components/CardGrid';
import { Header } from './components/Header';
import { Collection } from './components/Collection';
import { Wishlist } from './components/Wishlist';
import { HeroSection } from './components/HeroSection';
import { storageService, type StoredCard } from './services/storage';

type View = 'home' | 'collection' | 'wishlist';

export const Container = styled.div`
  padding: 2rem 1.5rem;
  max-width: 900px;
  margin: 0 auto;
`;

export const SearchSection = styled.div`
  margin-top: 0.5rem;
`;

export const Label = styled.label`
  display: block;
  margin-bottom: 1rem;
  font-size: 1.3rem;
  font-weight: 600;
  text-align: center;
  color: #f8f9fa;
`;

export const LoadingText = styled.p`
  color: #d1d5db;
  text-align: center;
  font-size: 1.1rem;
`;

export const ErrorBox = styled.div`
  padding: 1.5rem;
  background-color: rgba(255, 68, 68, 0.2);
  border-radius: 12px;
  color: #ff6b6b;
  margin-bottom: 1.5rem;
  border: 1px solid rgba(255, 68, 68, 0.4);
  text-align: center;
`;

export const SearchWrapper = styled.div`
  position: relative;
  max-width: 600px;
  margin: 0 auto;
  display: flex;
`;

export const SearchInput = styled.input`
  padding: 1rem 1.25rem;
  font-size: 1.05rem;
  width: 100%;
  border-radius: 12px;
  border: 2px solid rgba(100, 108, 255, 0.3);
  background-color: rgba(42, 42, 62, 0.6);
  backdrop-filter: blur(10px);
  color: #fff;
  transition: all 0.3s ease;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);

  &:focus {
    border-color: #667eea;
    box-shadow: 0 4px 20px rgba(100, 108, 255, 0.4);
    outline: none;
  }

  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }
`;

export const SuggestionsDropdown = styled.div`
  position: absolute;
  top: calc(100% + 0.5rem);
  left: 0;
  right: 0;
  background-color: rgba(42, 42, 62, 0.95);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(100, 108, 255, 0.3);
  border-radius: 12px;
  max-height: 400px;
  overflow-y: auto;
  z-index: 1000;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
`;

export const SuggestionItem = styled.div`
  padding: 1rem 1.25rem;
  cursor: pointer;
  border-bottom: 1px solid rgba(100, 108, 255, 0.1);
  transition: all 0.2s ease;
  background-color: transparent;

  &:hover {
    background-color: rgba(100, 108, 255, 0.2);
  }

  &:focus {
    background-color: rgba(100, 108, 255, 0.2);
    outline: 2px solid #667eea;
    outline-offset: -2px;
  }
`;

export const SuggestionTitle = styled.div`
  font-weight: 600;
  font-size: 1rem;
  margin-bottom: 0.25rem;
`;

export const SuggestionMeta = styled.div`
  font-size: 0.9rem;
  color: #d1d5db;
`;

export const SelectedSetContainer = styled.div`
  margin-top: 3rem;
  padding: 2rem;
  background-color: rgba(42, 42, 62, 0.6);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  border: 1px solid rgba(100, 108, 255, 0.2);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
`;

export const SetImagesContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
`;

export const SetLogo = styled.img`
  max-width: 250px;
  height: auto;
  filter: drop-shadow(0 4px 12px rgba(0, 0, 0, 0.5));
`;

export const SetSymbol = styled.img`
  max-width: 100px;
  height: auto;
  filter: drop-shadow(0 4px 12px rgba(0, 0, 0, 0.5));
`;

function App() {
  const [currentView, setCurrentView] = useState<View>('home');
  const [selectedSet, setSelectedSet] = useState('');
  const [sets, setSets] = useState<PokemonSet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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

  // Fetch all Pokemon TCG sets from the API
  useEffect(() => {
    const fetchSets = async () => {
      try {
        setLoading(true);
        setError(null);
        const setsData = await pokemonTcgApi.getSets();

        setSets(setsData);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Failed to fetch sets';
        setError(errorMessage);
        console.error('Error fetching sets:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSets();
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
