import type {
  SetsResponse,
  DetailedSet,
  CardsResponse,
  Card,
} from '../types/pokemon-tcg';

// TCGdex API - https://tcgdex.dev/
const BASE_URL = 'https://api.tcgdex.net/v2/en';

/**
 * Helper function to format TCGdex card image URLs
 * TCGdex card images need both quality and extension
 * Format: {baseUrl}/{quality}.{extension}
 *
 * @param imageUrl - Base image URL from API
 * @param quality - 'high' (600x825) or 'low' (245x337)
 * @param extension - 'webp' (recommended), 'png', or 'jpg'
 * @returns Formatted image URL
 */
export function formatImageUrl(
  imageUrl: string | undefined,
  quality: 'high' | 'low' = 'low',
  extension: 'webp' | 'png' | 'jpg' = 'webp'
): string {
  if (!imageUrl) return '';
  return `${imageUrl}/${quality}.${extension}`;
}

/**
 * Helper function to format TCGdex logo/symbol URLs
 * Logos and symbols only need extension (no quality parameter)
 * Format: {baseUrl}.{extension}
 *
 * @param assetUrl - Base asset URL from API (logo or symbol)
 * @param extension - 'webp' (recommended), 'png', or 'jpg'
 * @returns Formatted asset URL
 */
export function formatAssetUrl(
  assetUrl: string | undefined,
  extension: 'webp' | 'png' | 'jpg' = 'webp'
): string {
  if (!assetUrl) return '';
  return `${assetUrl}.${extension}`;
}

export const pokemonTcgApi = {
  /**
   * Fetch all sets
   * Returns a simple list of all available sets
   */
  async getSets(): Promise<SetsResponse> {
    const url = `${BASE_URL}/sets`;
    console.log('Fetching sets from:', url);

    const response = await fetch(url);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error:', response.status, errorText);
      throw new Error(
        `Failed to fetch sets: ${response.status} ${response.statusText}`
      );
    }

    return response.json();
  },

  /**
   * Fetch a detailed set by ID (includes cards list)
   * @param setId - The set ID (e.g., 'base1', 'swsh3', 'sv06')
   */
  async getSet(setId: string): Promise<DetailedSet> {
    const url = `${BASE_URL}/sets/${setId}`;
    console.log('Fetching set:', url);

    const response = await fetch(url);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error:', response.status, errorText);
      throw new Error(
        `Failed to fetch set: ${response.status} ${response.statusText}`
      );
    }

    return response.json();
  },

  /**
   * Fetch all cards from a specific set
   * @param setId - The set ID
   */
  async getCardsFromSet(setId: string): Promise<CardsResponse> {
    // First get the set to get the card IDs, then fetch detailed card info
    const set = await this.getSet(setId);

    // TCGdex returns card summaries in the set response
    // For detailed card info, we'd need to fetch each card individually
    // For now, we'll return the card summaries as a basic response
    return set.cards.map((card) => ({
      ...card,
      set: {
        id: set.id,
        name: set.name,
        logo: set.logo,
        symbol: set.symbol,
        cardCount: set.cardCount,
      },
    })) as CardsResponse;
  },

  /**
   * Fetch a single card by its full ID
   * @param cardId - The card ID (e.g., 'base1-4', 'swsh3-136')
   */
  async getCard(cardId: string): Promise<Card> {
    const url = `${BASE_URL}/card/${cardId}`;
    console.log('Fetching card:', url);

    const response = await fetch(url);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error:', response.status, errorText);
      throw new Error(
        `Failed to fetch card: ${response.status} ${response.statusText}`
      );
    }

    return response.json();
  },

  /**
   * Search for cards
   * @param query - Search query
   */
  async searchCards(query: string): Promise<CardsResponse> {
    const url = `${BASE_URL}/cards?name=${encodeURIComponent(query)}`;
    console.log('Searching cards:', url);

    const response = await fetch(url);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error:', response.status, errorText);
      throw new Error(
        `Failed to search cards: ${response.status} ${response.statusText}`
      );
    }

    return response.json();
  },
};
