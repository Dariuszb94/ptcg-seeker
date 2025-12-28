// TCGdex API Type Definitions

export interface CardCount {
  total: number;
  official: number;
  normal?: number;
  reverse?: number;
  holo?: number;
  firstEd?: number;
}

export interface Serie {
  id: string;
  name: string;
}

export interface Legal {
  standard: boolean;
  expanded: boolean;
}

export interface PokemonSet {
  id: string;
  name: string;
  logo?: string;
  symbol?: string;
  cardCount: CardCount;
  releaseDate?: string;
  legal?: Legal;
  serie?: Serie;
}

// Simple list response (for /sets endpoint)
export type SetsResponse = PokemonSet[];

// Detailed set response (for /set/:id endpoint)
export interface DetailedSet extends PokemonSet {
  cards: CardSummary[];
}

export interface CardSummary {
  id: string;
  localId: string;
  name: string;
  image: string;
}

export interface Card {
  id: string;
  localId: string;
  name: string;
  hp?: number;
  types?: string[];
  evolveFrom?: string;
  description?: string;
  level?: string;
  stage?: string;
  suffix?: string;
  item?: {
    name: string;
    effect: string;
  };
  abilities?: Ability[];
  attacks?: Attack[];
  weaknesses?: WeaknessResistance[];
  resistances?: WeaknessResistance[];
  retreat?: number;
  set: {
    id: string;
    name: string;
    logo?: string;
    symbol?: string;
    cardCount: CardCount;
  };
  dexId?: number[];
  rarity?: string;
  artist?: string;
  image?: string;
  category?: string;
  variants?: {
    normal?: boolean;
    reverse?: boolean;
    holo?: boolean;
    firstEdition?: boolean;
  };
}

export interface Ability {
  type: string;
  name: string;
  effect: string;
}

export interface Attack {
  cost?: string[];
  name: string;
  effect?: string;
  damage?: string | number;
}

export interface WeaknessResistance {
  type: string;
  value?: string;
}

export type CardsResponse = Card[];
