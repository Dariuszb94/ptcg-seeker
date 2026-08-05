import type { PokemonSet } from '../types/pokemon-tcg';
import { formatAssetUrl } from '../services/pokemon-tcg-api';
import { CardGrid } from './CardGrid';
import {
  SelectedSetContainer,
  SetImagesContainer,
  SetLogo,
  SetSymbol,
} from '../styles/App.styled';

type SelectedSetProps = {
  set: PokemonSet;
};

export function SelectedSet({ set }: SelectedSetProps) {
  return (
    <SelectedSetContainer>
      <SetImagesContainer>
        {set.logo && (
          <SetLogo
            src={formatAssetUrl(set.logo, 'webp')}
            alt={`${set.name} logo`}
            loading='lazy'
            onError={(e) => {
              const img = e.target as HTMLImageElement;
              if (img.src.endsWith('.webp')) {
                img.src = formatAssetUrl(set.logo, 'png');
              }
            }}
          />
        )}
        {set.symbol && (
          <SetSymbol
            src={formatAssetUrl(set.symbol, 'webp')}
            alt={`${set.name} symbol`}
            loading='lazy'
            onError={(e) => {
              const img = e.target as HTMLImageElement;
              if (img.src.endsWith('.webp')) {
                img.src = formatAssetUrl(set.symbol, 'png');
              }
            }}
          />
        )}
      </SetImagesContainer>

      <CardGrid setId={set.id} setName={set.name} />
    </SelectedSetContainer>
  );
}
