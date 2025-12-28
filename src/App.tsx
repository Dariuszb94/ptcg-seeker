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

  // Fetch all Pokemon TCG sets from the API
  useEffect(() => {
    const fetchSets = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log('Starting to fetch sets from TCGdex...');

        const setsData = await pokemonTcgApi.getSets();
        console.log('Fetched sets:', setsData.length);

        // Sort by release date (newest first)
        const sortedSets = [...setsData].sort((a, b) => {
          if (!a.releaseDate || !b.releaseDate) return 0;
          return (
            new Date(b.releaseDate).getTime() -
            new Date(a.releaseDate).getTime()
          );
        });

        setSets(sortedSets);
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
          <select
            id='set-select'
            value={selectedSet}
            onChange={(e) => setSelectedSet(e.target.value)}
            style={{
              padding: '0.5rem',
              fontSize: '1rem',
              width: '100%',
              maxWidth: '400px',
              borderRadius: '4px',
              border: '2px solid #646cff',
            }}
          >
            <option value=''>-- Choose a set --</option>
            {sets.map((set) => (
              <option key={set.id} value={set.id}>
                {set.name}{' '}
                {set.releaseDate ? `(${set.releaseDate.split('-')[0]})` : ''}
              </option>
            ))}
          </select>
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
