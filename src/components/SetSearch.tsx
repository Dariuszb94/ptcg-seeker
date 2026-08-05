import type { PokemonSet } from '../types/pokemon-tcg';
import {
  SearchSection,
  Label,
  LoadingText,
  ErrorBox,
  SearchWrapper,
  SearchInput,
  SuggestionsDropdown,
  SuggestionItem,
  SuggestionTitle,
  SuggestionMeta,
} from '../styles/App.styled';

type SetSearchProps = {
  sets: PokemonSet[];
  loading: boolean;
  error: string | null;
  searchInput: string;
  selectedSet: string;
  showSuggestions: boolean;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSelectSet: (set: PokemonSet) => void;
  onInputFocus: () => void;
  onInputBlur: () => void;
};

export function SetSearch({
  sets,
  loading,
  error,
  searchInput,
  selectedSet,
  showSuggestions,
  onInputChange,
  onSelectSet,
  onInputFocus,
  onInputBlur,
}: SetSearchProps) {
  // Filter sets based on search input
  const filteredSets = sets.filter((set) => {
    const searchTerm = searchInput.toLowerCase();
    return (
      set.name.toLowerCase().includes(searchTerm) ||
      set.id.toLowerCase().includes(searchTerm) ||
      set.serie?.name.toLowerCase().includes(searchTerm) ||
      set.releaseDate?.includes(searchTerm)
    );
  });

  return (
    <SearchSection>
      <Label htmlFor='set-select'>Select a Pokemon TCG Set</Label>

      {loading && <LoadingText>Loading sets...</LoadingText>}

      {error && (
        <ErrorBox>
          <p>Error: {error}</p>
        </ErrorBox>
      )}

      {!loading && !error && (
        <SearchWrapper>
          <SearchInput
            id='set-select'
            type='text'
            value={searchInput}
            onChange={onInputChange}
            onFocus={onInputFocus}
            onBlur={onInputBlur}
            placeholder='Search for a Pokemon TCG set...'
            role='combobox'
            aria-expanded={showSuggestions && filteredSets.length > 0}
            aria-controls='set-suggestions'
            aria-autocomplete='list'
            aria-label='Search for Pokemon TCG sets by name or series'
          />
          {showSuggestions && filteredSets.length > 0 && (
            <SuggestionsDropdown
              id='set-suggestions'
              role='listbox'
              aria-label='Pokemon TCG set suggestions'
            >
              {filteredSets.slice(0, 10).map((set) => (
                <SuggestionItem
                  key={set.id}
                  role='option'
                  aria-selected={selectedSet === set.id}
                  tabIndex={0}
                  onClick={() => onSelectSet(set)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      onSelectSet(set);
                    }
                  }}
                >
                  <SuggestionTitle>{set.name}</SuggestionTitle>
                  <SuggestionMeta>
                    {set.releaseDate ? `${set.releaseDate.split('-')[0]}` : ''}{' '}
                    {set.serie?.name ? `• ${set.serie.name}` : ''}
                  </SuggestionMeta>
                </SuggestionItem>
              ))}
            </SuggestionsDropdown>
          )}
        </SearchWrapper>
      )}
    </SearchSection>
  );
}
