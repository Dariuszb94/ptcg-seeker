// Local storage service for managing collection and wishlist

export interface StoredCard {
  id: string;
  localId: string;
  name: string;
  image: string;
  setId: string;
  setName: string;
  addedAt: string;
}

const COLLECTION_KEY = 'ptcg-collection';
const WISHLIST_KEY = 'ptcg-wishlist';

class StorageService {
  // Collection methods
  getCollection(): StoredCard[] {
    const data = localStorage.getItem(COLLECTION_KEY);
    return data ? JSON.parse(data) : [];
  }

  addToCollection(card: StoredCard): void {
    const collection = this.getCollection();
    // Avoid duplicates
    if (!collection.find((c) => c.id === card.id)) {
      collection.push(card);
      localStorage.setItem(COLLECTION_KEY, JSON.stringify(collection));
    }
  }

  removeFromCollection(cardId: string): void {
    const collection = this.getCollection();
    const filtered = collection.filter((c) => c.id !== cardId);
    localStorage.setItem(COLLECTION_KEY, JSON.stringify(filtered));
  }

  isInCollection(cardId: string): boolean {
    const collection = this.getCollection();
    return collection.some((c) => c.id === cardId);
  }

  // Wishlist methods
  getWishlist(): StoredCard[] {
    const data = localStorage.getItem(WISHLIST_KEY);
    return data ? JSON.parse(data) : [];
  }

  addToWishlist(card: StoredCard): void {
    const wishlist = this.getWishlist();
    // Avoid duplicates
    if (!wishlist.find((c) => c.id === card.id)) {
      wishlist.push(card);
      localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlist));
    }
  }

  removeFromWishlist(cardId: string): void {
    const wishlist = this.getWishlist();
    const filtered = wishlist.filter((c) => c.id !== cardId);
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(filtered));
  }

  isInWishlist(cardId: string): boolean {
    const wishlist = this.getWishlist();
    return wishlist.some((c) => c.id === cardId);
  }
}

export const storageService = new StorageService();
