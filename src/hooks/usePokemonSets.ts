import { useState, useEffect } from 'react';
import { pokemonTcgApi } from '../services/pokemon-tcg-api';
import type { PokemonSet } from '../types/pokemon-tcg';

export function usePokemonSets() {
  const [sets, setSets] = useState<PokemonSet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  return { sets, loading, error };
}
