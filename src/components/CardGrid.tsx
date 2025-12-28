import { useState, useEffect } from 'react';
import { pokemonTcgApi, formatImageUrl } from '../services/pokemon-tcg-api';

interface CardSummary {
  id: string;
  localId: string;
  name: string;
  image: string;
}

interface CardGridProps {
  setId: string;
}

export function CardGrid({ setId }: CardGridProps) {
  const [cards, setCards] = useState<CardSummary[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load cards automatically when setId changes
  useEffect(() => {
    const loadCards = async () => {
      try {
        setLoading(true);
        setError(null);
        const cardsData = await pokemonTcgApi.getCardsFromSet(setId);
        // Map to ensure we have the required CardSummary structure
        // TCGdex images need format: {imageUrl}/low.webp or {imageUrl}/high.webp
        const cardSummaries = cardsData.map((card) => ({
          id: card.id,
          localId: card.localId,
          name: card.name,
          image: formatImageUrl(card.image, 'low', 'webp'),
        }));
        setCards(cardSummaries);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch cards');
        console.error('Error fetching cards:', err);
      } finally {
        setLoading(false);
      }
    };

    loadCards();
  }, [setId]);

  if (loading) {
    return <p style={{ color: '#888', marginTop: '1rem' }}>Loading cards...</p>;
  }

  if (error) {
    return (
      <div
        style={{
          padding: '1rem',
          backgroundColor: '#ff000020',
          borderRadius: '4px',
          color: '#ff6b6b',
          marginTop: '1rem',
        }}
      >
        <p>Error: {error}</p>
      </div>
    );
  }

  return (
    <div style={{ marginTop: '2rem' }}>
      <h3>Cards in this Set ({cards.length})</h3>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: '1rem',
          marginTop: '1rem',
        }}
      >
        {cards.map((card) => (
          <div
            key={card.id}
            style={{
              backgroundColor: '#2a2a2a',
              borderRadius: '8px',
              padding: '1rem',
              textAlign: 'center',
            }}
          >
            <img
              src={card.image}
              alt={card.name}
              loading='lazy'
              style={{
                width: '100%',
                height: 'auto',
                borderRadius: '4px',
              }}
              onError={(e) => {
                // Fallback to PNG if WebP fails
                const img = e.target as HTMLImageElement;
                if (img.src.endsWith('.webp')) {
                  img.src = img.src.replace('.webp', '.png');
                }
              }}
            />
            <p style={{ marginTop: '0.5rem', fontWeight: 'bold' }}>
              {card.name}
            </p>
            <p style={{ fontSize: '0.9rem', color: '#888' }}>#{card.localId}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
