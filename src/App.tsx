import { useState, useEffect } from 'react';
import './App.css';
import { pokemonTcgApi, formatAssetUrl } from './services/pokemon-tcg-api';
import type { PokemonSet } from './types/pokemon-tcg';
import { CardGrid } from './components/CardGrid';

function App() {
  const [selectedSet, setSelectedSet] = useState('');
  const [sets, setSets] = useState<PokemonSet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchInput, setSearchInput] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

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

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Pokemon TCG Card Selector</h1>

      <div style={{ marginTop: '2rem' }}>
        <label
          htmlFor='set-select'
          style={{
            display: 'block',
            marginBottom: '0.5rem',
            fontSize: '1.1rem',
          }}
        >
          Select a Pokemon TCG Set:
        </label>

        {loading && <p style={{ color: '#888' }}>Loading sets...</p>}

        {error && (
          <div
            style={{
              padding: '1rem',
              backgroundColor: '#ff000020',
              borderRadius: '4px',
              color: '#ff6b6b',
              marginBottom: '1rem',
            }}
          >
            <p>Error: {error}</p>
          </div>
        )}

        {!loading && !error && (
          <div
            style={{
              position: 'relative',
              maxWidth: '400px',
              margin: '0 auto',
            }}
          >
            <input
              id='set-select'
              type='text'
              value={searchInput}
              onChange={handleInputChange}
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
              placeholder='Search for a Pokemon TCG set...'
              style={{
                padding: '0.5rem',
                fontSize: '1rem',
                width: '100%',
                borderRadius: '4px',
                border: '2px solid #646cff',
                backgroundColor: '#1a1a1a',
                color: '#fff',
              }}
            />
            {showSuggestions && filteredSets.length > 0 && (
              <div
                style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  right: 0,
                  backgroundColor: '#1a1a1a',
                  border: '2px solid #646cff',
                  borderTop: 'none',
                  borderRadius: '0 0 4px 4px',
                  maxHeight: '300px',
                  overflowY: 'auto',
                  zIndex: 1000,
                }}
              >
                {filteredSets.slice(0, 10).map((set) => (
                  <div
                    key={set.id}
                    onClick={() => handleSelectSet(set)}
                    style={{
                      padding: '0.75rem',
                      cursor: 'pointer',
                      borderBottom: '1px solid #333',
                      transition: 'background-color 0.2s',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#2a2a2a';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent';
                    }}
                  >
                    <div style={{ fontWeight: 'bold' }}>{set.name}</div>
                    <div style={{ fontSize: '0.85rem', color: '#888' }}>
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
            marginTop: '2rem',
            padding: '1.5rem',
            backgroundColor: '#1a1a1a',
            borderRadius: '8px',
          }}
        >
          <h2>Selected Set:</h2>
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
                    gap: '1rem',
                    marginTop: '1rem',
                  }}
                >
                  {set.logo && (
                    <img
                      src={formatAssetUrl(set.logo, 'webp')}
                      alt={`${set.name} logo`}
                      style={{ maxWidth: '200px', height: 'auto' }}
                      loading='lazy'
                      onError={(e) => {
                        // Fallback to PNG if WebP fails
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
                      style={{ maxWidth: '80px', height: 'auto' }}
                      loading='lazy'
                      onError={(e) => {
                        // Fallback to PNG if WebP fails
                        const img = e.target as HTMLImageElement;
                        if (img.src.endsWith('.webp')) {
                          img.src = formatAssetUrl(set.symbol, 'png');
                        }
                      }}
                    />
                  )}
                </div>
                <div style={{ marginTop: '1rem' }}>
                  <p>
                    <strong>Name:</strong> {set.name}
                  </p>
                  {set.serie && (
                    <p>
                      <strong>Series:</strong> {set.serie.name}
                    </p>
                  )}
                  {set.releaseDate && (
                    <p>
                      <strong>Release Date:</strong> {set.releaseDate}
                    </p>
                  )}
                  <p>
                    <strong>Total Cards:</strong> {set.cardCount.total}
                  </p>
                  <p>
                    <strong>Official Cards:</strong> {set.cardCount.official}
                  </p>
                  {set.legal && (
                    <>
                      <p>
                        <strong>Legalities:</strong>
                      </p>
                      <ul style={{ marginLeft: '2rem' }}>
                        <li>
                          Standard: {set.legal.standard ? 'Legal' : 'Not Legal'}
                        </li>
                        <li>
                          Expanded: {set.legal.expanded ? 'Legal' : 'Not Legal'}
                        </li>
                      </ul>
                    </>
                  )}
                </div>

                <CardGrid setId={selectedSet} />
              </>
            );
          })()}
        </div>
      )}
    </div>
  );
}

export default App;
