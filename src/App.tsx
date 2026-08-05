import type { PokemonSet } from './types/pokemon-tcg';
import type { View } from './types/app';
import { Header } from './components/Header';
import { Collection } from './components/Collection';
import { Wishlist } from './components/Wishlist';
import { HomeView } from './components/HomeView';
import { usePokemonSets } from './hooks/usePokemonSets';
import { useAppState } from './hooks/useAppState';

function App() {
  const { state, dispatch } = useAppState();
  const { sets, loading, error } = usePokemonSets();

  const handleNavigate = (view: View) => {
    dispatch({ type: 'NAVIGATE', payload: view });
    if (view !== 'wishlist') {
      window.history.replaceState({}, '', window.location.pathname);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({ type: 'SET_SEARCH_INPUT', payload: e.target.value });
  };

  const handleSelectSet = (set: PokemonSet) => {
    dispatch({ type: 'SELECT_SET', payload: { set } });
  };

  const handleInputFocus = () => {
    dispatch({ type: 'SET_SHOW_SUGGESTIONS', payload: true });
  };

  const handleInputBlur = () => {
    setTimeout(
      () => dispatch({ type: 'SET_SHOW_SUGGESTIONS', payload: false }),
      200,
    );
  };

  if (state.currentView === 'collection') {
    return (
      <>
        <Header onNavigate={handleNavigate} currentView={state.currentView} />
        <main id='main-content'>
          <Collection />
        </main>
      </>
    );
  }

  if (state.currentView === 'wishlist') {
    return (
      <>
        <Header onNavigate={handleNavigate} currentView={state.currentView} />
        <main id='main-content'>
          <Wishlist sharedCards={state.sharedWishlist} ownerName='Friend' />
        </main>
      </>
    );
  }

  return (
    <HomeView
      sets={sets}
      loading={loading}
      error={error}
      currentView={state.currentView}
      searchInput={state.searchInput}
      selectedSet={state.selectedSet}
      showSuggestions={state.showSuggestions}
      onNavigate={handleNavigate}
      onInputChange={handleInputChange}
      onSelectSet={handleSelectSet}
      onInputFocus={handleInputFocus}
      onInputBlur={handleInputBlur}
    />
  );
}

export default App;
