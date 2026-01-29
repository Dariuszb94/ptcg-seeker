/**
 * Local storage service for managing collection and wishlist
 * Provides type-safe operations for storing and retrieving Pokemon TCG cards
 */

export interface StoredCard {
  id: string;
  localId: string;
  name: string;
  image: string;
  setId: string;
  setName: string;
  addedAt: string;
}

const STORAGE_KEYS = {
  COLLECTION: 'ptcg-collection',
  WISHLIST: 'ptcg-wishlist',
} as const;

type StorageKey = (typeof STORAGE_KEYS)[keyof typeof STORAGE_KEYS];

class StorageService {
  /**
   * Generic method to retrieve items from localStorage
   * @param key - The storage key to retrieve from
   * @returns Array of stored cards or empty array if none found
   */
  private getItems(key: StorageKey): StoredCard[] {
    try {
      const data = localStorage.getItem(key);
      if (!data) return [];

      const parsed = JSON.parse(data);
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      console.error(`Failed to retrieve items from ${key}:`, error);
      return [];
    }
  }

  /**
   * Generic method to save items to localStorage
   * @param key - The storage key to save to
   * @param items - Array of cards to save
   */
  private setItems(key: StorageKey, items: StoredCard[]): void {
    try {
      localStorage.setItem(key, JSON.stringify(items));
    } catch (error) {
      console.error(`Failed to save items to ${key}:`, error);
    }
  }

  /**
   * Generic method to add a card to a storage list
   * @param key - The storage key to add to
   * @param card - The card to add
   * @returns true if card was added, false if it already existed
   */
  private addItem(key: StorageKey, card: StoredCard): boolean {
    const items = this.getItems(key);

    if (items.some((item) => item.id === card.id)) {
      return false; // Card already exists
    }

    items.push(card);
    this.setItems(key, items);
    return true;
  }

  /**
   * Generic method to remove a card from a storage list
   * @param key - The storage key to remove from
   * @param cardId - The ID of the card to remove
   * @returns true if card was removed, false if not found
   */
  private removeItem(key: StorageKey, cardId: string): boolean {
    const items = this.getItems(key);
    const initialLength = items.length;
    const filtered = items.filter((item) => item.id !== cardId);

    if (filtered.length !== initialLength) {
      this.setItems(key, filtered);
      return true;
    }

    return false;
  }

  /**
   * Generic method to check if a card exists in a storage list
   * @param key - The storage key to check
   * @param cardId - The ID of the card to check for
   * @returns true if card exists, false otherwise
   */
  private hasItem(key: StorageKey, cardId: string): boolean {
    const items = this.getItems(key);
    return items.some((item) => item.id === cardId);
  }

  // Collection methods

  /** Get all cards in the collection */
  getCollection(): StoredCard[] {
    return this.getItems(STORAGE_KEYS.COLLECTION);
  }

  /** Add a card to the collection */
  addToCollection(card: StoredCard): boolean {
    return this.addItem(STORAGE_KEYS.COLLECTION, card);
  }

  /** Remove a card from the collection */
  removeFromCollection(cardId: string): boolean {
    return this.removeItem(STORAGE_KEYS.COLLECTION, cardId);
  }

  /** Check if a card is in the collection */
  isInCollection(cardId: string): boolean {
    return this.hasItem(STORAGE_KEYS.COLLECTION, cardId);
  }

  // Wishlist methods

  /** Get all cards in the wishlist */
  getWishlist(): StoredCard[] {
    return this.getItems(STORAGE_KEYS.WISHLIST);
  }

  /** Add a card to the wishlist */
  addToWishlist(card: StoredCard): boolean {
    return this.addItem(STORAGE_KEYS.WISHLIST, card);
  }

  /** Remove a card from the wishlist */
  removeFromWishlist(cardId: string): boolean {
    return this.removeItem(STORAGE_KEYS.WISHLIST, cardId);
  }

  /** Check if a card is in the wishlist */
  isInWishlist(cardId: string): boolean {
    return this.hasItem(STORAGE_KEYS.WISHLIST, cardId);
  }

  // Share methods

  /**
   * Encode wishlist for sharing via URL
   * @returns Base64 encoded string of card IDs
   */
  encodeWishlistForSharing(): string {
    try {
      const wishlist = this.getWishlist();
      const cardIds = wishlist.map((card) => card.id);
      const data = JSON.stringify(cardIds);
      return btoa(data);
    } catch (error) {
      console.error('Failed to encode wishlist for sharing:', error);
      return '';
    }
  }

  /**
   * Decode a shared wishlist from a Base64 string
   * @param encoded - Base64 encoded string of card IDs
   * @returns Array of stored cards with available data
   */
  decodeSharedWishlist(encoded: string): StoredCard[] {
    try {
      const data = atob(encoded);
      const cardIds: string[] = JSON.parse(data);

      if (!Array.isArray(cardIds)) {
        throw new Error('Invalid data format');
      }

      return cardIds.map(
        (id) => this.findCardById(id) || this.createPlaceholderCard(id)
      );
    } catch (error) {
      console.error('Failed to decode shared wishlist:', error);
      return [];
    }
  }

  /**
   * Find a card by ID in local storage (collection or wishlist)
   * @param cardId - The card ID to search for
   * @returns The stored card if found, undefined otherwise
   */
  private findCardById(cardId: string): StoredCard | undefined {
    const allCards = [...this.getCollection(), ...this.getWishlist()];
    return allCards.find((card) => card.id === cardId);
  }

  /**
   * Create a placeholder card for cards not found locally
   * @param cardId - The card ID to create a placeholder for
   * @returns A placeholder StoredCard object
   */
  private createPlaceholderCard(cardId: string): StoredCard {
    const parts = cardId.split('-');
    return {
      id: cardId,
      localId: parts.pop() || '',
      name: 'Loading...',
      image: '',
      setId: parts[0] || '',
      setName: '',
      addedAt: new Date().toISOString(),
    };
  }

  /**
   * Clear all data from localStorage
   * WARNING: This will remove all collections and wishlists
   */
  clearAll(): void {
    try {
      localStorage.removeItem(STORAGE_KEYS.COLLECTION);
      localStorage.removeItem(STORAGE_KEYS.WISHLIST);
    } catch (error) {
      console.error('Failed to clear storage:', error);
    }
  }

  /**
   * Get total count of cards across collection and wishlist
   * @returns Object with collection and wishlist counts
   */
  getCounts(): { collection: number; wishlist: number } {
    return {
      collection: this.getCollection().length,
      wishlist: this.getWishlist().length,
    };
  }
}

export const storageService = new StorageService();
