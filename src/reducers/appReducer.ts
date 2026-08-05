import type { AppState, AppAction } from '../types/app';

export const initialAppState: AppState = {
  currentView: 'home',
  selectedSet: '',
  searchInput: '',
  showSuggestions: false,
  sharedWishlist: null,
};

export function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_VIEW':
      return { ...state, currentView: action.payload };
    case 'SET_SELECTED_SET':
      return { ...state, selectedSet: action.payload };
    case 'SET_SEARCH_INPUT':
      return {
        ...state,
        searchInput: action.payload,
        showSuggestions: true,
        selectedSet: action.payload ? state.selectedSet : '',
      };
    case 'SET_SHOW_SUGGESTIONS':
      return { ...state, showSuggestions: action.payload };
    case 'SET_SHARED_WISHLIST':
      return { ...state, sharedWishlist: action.payload };
    case 'SELECT_SET':
      return {
        ...state,
        selectedSet: action.payload.set.id,
        searchInput: action.payload.set.name,
        showSuggestions: false,
      };
    case 'NAVIGATE':
      return {
        ...state,
        currentView: action.payload,
        sharedWishlist:
          action.payload !== 'wishlist' ? null : state.sharedWishlist,
      };
    case 'CLEAR_SEARCH':
      return {
        ...state,
        searchInput: '',
        selectedSet: '',
        showSuggestions: false,
      };
    default:
      return state;
  }
}
