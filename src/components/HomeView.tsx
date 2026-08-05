import type { PokemonSet } from '../types/pokemon-tcg';
import type { View } from '../types/app';
import { Header } from './Header';
import { SetSearch } from './SetSearch';
import { SelectedSet } from './SelectedSet';
import { HeroSection } from './HeroSection';
import { Container } from '../styles/App.styled';

type HomeViewProps = {
  sets: PokemonSet[];
  loading: boolean;
  error: string | null;
  currentView: View;
  searchInput: string;
  selectedSet: string;
  showSuggestions: boolean;
  onNavigate: (view: View) => void;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSelectSet: (set: PokemonSet) => void;
  onInputFocus: () => void;
  onInputBlur: () => void;
};

export function HomeView({
  sets,
  loading,
  error,
  currentView,
  searchInput,
  selectedSet,
  showSuggestions,
  onNavigate,
  onInputChange,
  onSelectSet,
  onInputFocus,
  onInputBlur,
}: HomeViewProps) {
  const currentSet = sets.find((s) => s.id === selectedSet);

  return (
    <>
      <Header onNavigate={onNavigate} currentView={currentView} />

      <main id='main-content'>
        <Container>
          <SetSearch
            sets={sets}
            loading={loading}
            error={error}
            searchInput={searchInput}
            selectedSet={selectedSet}
            showSuggestions={showSuggestions}
            onInputChange={onInputChange}
            onSelectSet={onSelectSet}
            onInputFocus={onInputFocus}
            onInputBlur={onInputBlur}
          />

          {currentSet && <SelectedSet set={currentSet} />}
        </Container>

        {/* Show Hero Section when no set is selected */}
        {!selectedSet && <HeroSection />}
      </main>
    </>
  );
}
