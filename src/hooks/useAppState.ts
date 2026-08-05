import { useReducer, useEffect } from 'react';
import { appReducer, initialAppState } from '../reducers/appReducer';
import { storageService } from '../services/storage';

export function useAppState() {
  const [state, dispatch] = useReducer(appReducer, initialAppState);

  // Check for shared wishlist in URL on mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const wishlistParam = urlParams.get('wishlist');

    if (wishlistParam) {
      const decoded = storageService.decodeSharedWishlist(wishlistParam);
      if (decoded.length > 0) {
        dispatch({ type: 'SET_SHARED_WISHLIST', payload: decoded });
        dispatch({ type: 'SET_VIEW', payload: 'wishlist' });
      }
    }
  }, []);

  return { state, dispatch };
}
