import { useState, useEffect } from 'react';
import './App.css';
import { pokemonTcgApi, formatAssetUrl } from './services/pokemon-tcg-api';
import type { PokemonSet } from './types/pokemon-tcg';
import { CardGrid } from './components/CardGrid';
import { Header } from './components/Header';
import { Collection } from './components/Collection';
import { Wishlist } from './components/Wishlist';
import { storageService, type StoredCard } from './services/storage';

type View = 'home' | 'collection' | 'wishlist';

function App() {
  const [currentView, setCurrentView] = useState<View>('home');
  const [selectedSet, setSelectedSet] = useState('');
  const [sets, setSets] = useState<PokemonSet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchInput, setSearchInput] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [sharedWishlist, setSharedWishlist] = useState<StoredCard[] | null>(
    null
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
        <Collection />
      </>
    );
  }

  if (currentView === 'wishlist') {
    return (
      <>
        <Header onNavigate={handleNavigate} currentView={currentView} />
        <Wishlist sharedCards={sharedWishlist} ownerName='Friend' />
      </>
    );
  }

  return (
    <>
      <Header onNavigate={handleNavigate} currentView={currentView} />
      <div
        style={{ padding: '2rem 1.5rem', maxWidth: '900px', margin: '0 auto' }}
      >
        <div style={{ marginTop: '2rem' }}>
          <label
            htmlFor='set-select'
            style={{
              display: 'block',
              marginBottom: '1rem',
              fontSize: '1.3rem',
              fontWeight: '600',
              textAlign: 'center',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Select a Pokemon TCG Set
          </label>

          {loading && (
            <p
              style={{
                color: '#a0a0c0',
                textAlign: 'center',
                fontSize: '1.1rem',
              }}
            >
              Loading sets...
            </p>
          )}

          {error && (
            <div
              style={{
                padding: '1.5rem',
                backgroundColor: 'rgba(255, 68, 68, 0.2)',
                borderRadius: '12px',
                color: '#ff6b6b',
                marginBottom: '1.5rem',
                border: '1px solid rgba(255, 68, 68, 0.4)',
                textAlign: 'center',
              }}
            >
              <p>Error: {error}</p>
            </div>
          )}

          {!loading && !error && (
            <div
              style={{
                position: 'relative',
                maxWidth: '600px',
                margin: '0 auto',
              }}
            >
              <input
                id='set-select'
                type='text'
                value={searchInput}
                onChange={handleInputChange}
                onFocus={(e) => {
                  handleInputFocus();
                  e.currentTarget.style.borderColor = '#667eea';
                  e.currentTarget.style.boxShadow =
                    '0 4px 20px rgba(100, 108, 255, 0.4)';
                }}
                onBlur={(e) => {
                  setTimeout(() => {
                    handleInputBlur();
                    e.currentTarget.style.borderColor =
                      'rgba(100, 108, 255, 0.3)';
                    e.currentTarget.style.boxShadow =
                      '0 4px 20px rgba(0, 0, 0, 0.2)';
                  }, 200);
                }}
                placeholder='Search for a Pokemon TCG set...'
                style={{
                  padding: '1rem 1.25rem',
                  fontSize: '1.05rem',
                  width: '100%',
                  borderRadius: '12px',
                  border: '2px solid rgba(100, 108, 255, 0.3)',
                  backgroundColor: 'rgba(42, 42, 62, 0.6)',
                  backdropFilter: 'blur(10px)',
                  color: '#fff',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
                }}
              />
              {showSuggestions && filteredSets.length > 0 && (
                <div
                  style={{
                    position: 'absolute',
                    top: 'calc(100% + 0.5rem)',
                    left: 0,
                    right: 0,
                    backgroundColor: 'rgba(42, 42, 62, 0.95)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(100, 108, 255, 0.3)',
                    borderRadius: '12px',
                    maxHeight: '400px',
                    overflowY: 'auto',
                    zIndex: 1000,
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
                  }}
                >
                  {filteredSets.slice(0, 10).map((set) => (
                    <div
                      key={set.id}
                      onClick={() => handleSelectSet(set)}
                      style={{
                        padding: '1rem 1.25rem',
                        cursor: 'pointer',
                        borderBottom: '1px solid rgba(100, 108, 255, 0.1)',
                        transition: 'all 0.2s ease',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor =
                          'rgba(100, 108, 255, 0.2)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                      }}
                    >
                      <div
                        style={{
                          fontWeight: '600',
                          fontSize: '1rem',
                          marginBottom: '0.25rem',
                        }}
                      >
                        {set.name}
                      </div>
                      <div style={{ fontSize: '0.9rem', color: '#a0a0c0' }}>
                        {set.releaseDate
                          ? `${set.releaseDate.split('-')[0]}`
                          : ''}{' '}
                        {set.serie?.name ? `• ${set.serie.name}` : ''}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {selectedSet && (
          <div
            style={{
              marginTop: '3rem',
              padding: '2rem',
              backgroundColor: 'rgba(42, 42, 62, 0.6)',
              backdropFilter: 'blur(10px)',
              borderRadius: '16px',
              border: '1px solid rgba(100, 108, 255, 0.2)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
            }}
          >
            {(() => {
              const set = sets.find((s) => s.id === selectedSet);
              if (!set) return null;
              console.log({ set });
              return (
                <>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '2rem',
                      marginBottom: '2rem',
                      flexWrap: 'wrap',
                    }}
                  >
                    {set.logo && (
                      <img
                        src={formatAssetUrl(set.logo, 'webp')}
                        alt={`${set.name} logo`}
                        style={{
                          maxWidth: '250px',
                          height: 'auto',
                          filter: 'drop-shadow(0 4px 12px rgba(0, 0, 0, 0.5))',
                        }}
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
                      <img
                        src={formatAssetUrl(set.symbol, 'webp')}
                        alt={`${set.name} symbol`}
                        style={{
                          maxWidth: '100px',
                          height: 'auto',
                          filter: 'drop-shadow(0 4px 12px rgba(0, 0, 0, 0.5))',
                        }}
                        loading='lazy'
                        onError={(e) => {
                          const img = e.target as HTMLImageElement;
                          if (img.src.endsWith('.webp')) {
                            img.src = formatAssetUrl(set.symbol, 'png');
                          }
                        }}
                      />
                    )}
                  </div>

                  <CardGrid setId={selectedSet} setName={set.name} />
                </>
              );
            })()}
          </div>
        )}
      </div>
    </>
  );
}

export default App;
