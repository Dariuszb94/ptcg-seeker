import type { StoredCard } from '../services/storage';
import type { PokemonSet } from './pokemon-tcg';

export type View = 'home' | 'collection' | 'wishlist';

export type AppState = {
  currentView: View;
  selectedSet: string;
  searchInput: string;
  showSuggestions: boolean;
  sharedWishlist: StoredCard[] | null;
};

export type AppAction =
  | { type: 'SET_VIEW'; payload: View }
  | { type: 'SET_SELECTED_SET'; payload: string }
  | { type: 'SET_SEARCH_INPUT'; payload: string }
  | { type: 'SET_SHOW_SUGGESTIONS'; payload: boolean }
  | { type: 'SET_SHARED_WISHLIST'; payload: StoredCard[] | null }
  | { type: 'SELECT_SET'; payload: { set: PokemonSet } }
  | { type: 'NAVIGATE'; payload: View }
  | { type: 'CLEAR_SEARCH' };
