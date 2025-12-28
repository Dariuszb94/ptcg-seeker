# TCGdex API Integration Guide

This project uses the [TCGdex API](https://tcgdex.dev/) - a free, multilingual Pokémon TCG API with comprehensive card data.

## API Overview

- **Base URL**: `https://api.tcgdex.net/v2/en`
- **Documentation**: https://tcgdex.dev/
- **Languages**: 10+ languages supported
- **Completely Free**: No API key required, no rate limits!

## Why TCGdex?

✅ **100% Free** - No API keys, no authentication, no rate limits  
✅ **Always Updated** - Community-driven, regularly updated with new sets  
✅ **Multilingual** - Available in 10+ languages  
✅ **Comprehensive** - Full card data including images, stats, abilities  
✅ **Open Source** - Transparent and community-maintained

## Image URLs - Important!

TCGdex provides base image URLs without file extensions. You must add the quality and format:

### Card Images

**Format**: `{baseUrl}/{quality}.{extension}`

**Quality Options:**

- `high` - 600x825px (for detailed views)
- `low` - 245x337px (for thumbnails/grids)

**Extension Options:**

- `webp` - Modern format, smaller size, transparent background ✅ **Recommended**
- `png` - Transparent background, larger file size
- `jpg` - Black background, not recommended

**Examples:**

```
Base URL from API: https://assets.tcgdex.net/en/base/base1/4

Low quality WebP:  https://assets.tcgdex.net/en/base/base1/4/low.webp
High quality WebP: https://assets.tcgdex.net/en/base/base1/4/high.webp
Low quality PNG:   https://assets.tcgdex.net/en/base/base1/4/low.png
```

**Helper Function for Cards:**

```typescript
import { formatImageUrl } from './services/pokemon-tcg-api';

const imageUrl = formatImageUrl(card.image, 'low', 'webp');
// Returns: {card.image}/low.webp
```

### Logos and Symbols

**Format**: `{baseUrl}.{extension}` (no quality parameter needed)

**Examples:**

```
Base URL from API: https://assets.tcgdex.net/en/base/base1/logo

WebP format: https://assets.tcgdex.net/en/base/base1/logo.webp
PNG format:  https://assets.tcgdex.net/en/base/base1/logo.png
```

**Helper Function for Logos/Symbols:**

```typescript
import { formatAssetUrl } from './services/pokemon-tcg-api';

const logoUrl = formatAssetUrl(set.logo, 'webp');
const symbolUrl = formatAssetUrl(set.symbol, 'webp');
// Returns: {url}.webp
```

## Available Endpoints

### Get All Sets

```
GET https://api.tcgdex.net/v2/en/sets
```

Returns an array of all available sets:

```json
[
  {
    "id": "base1",
    "name": "Base Set",
    "logo": "https://assets.tcgdex.net/en/base/base1/logo",
    "cardCount": {
      "total": 102,
      "official": 102
    },
    "releaseDate": "1999-01-09",
    "legal": {
      "standard": false,
      "expanded": true
    },
    "serie": {
      "id": "base",
      "name": "Base"
    }
  }
]
```

### Get Single Set (with cards)

```
GET https://api.tcgdex.net/v2/en/set/{setId}
```

Example: `https://api.tcgdex.net/v2/en/set/base1`

Returns detailed set information including all cards:

```json
{
  "id": "base1",
  "name": "Base Set",
  "logo": "https://assets.tcgdex.net/en/base/base1/logo",
  "symbol": "https://assets.tcgdex.net/univ/base/base1/symbol",
  "cardCount": {
    "total": 102,
    "official": 102,
    "normal": 102,
    "reverse": 0,
    "holo": 16
  },
  "cards": [
    {
      "id": "base1-1",
      "localId": "1",
      "name": "Alakazam",
      "image": "https://assets.tcgdex.net/en/base/base1/1"
    }
  ],
  "releaseDate": "1999-01-09",
  "legal": {
    "standard": false,
    "expanded": true
  },
  "serie": {
    "id": "base",
    "name": "Base"
  }
}
```

### Get Single Card

```
GET https://api.tcgdex.net/v2/en/card/{cardId}
```

Example: `https://api.tcgdex.net/v2/en/card/base1-4`

Returns detailed card information:

```json
{
  "id": "base1-4",
  "localId": "4",
  "name": "Charizard",
  "hp": 120,
  "types": ["Fire"],
  "stage": "Stage 2",
  "evolveFrom": "Charmeleon",
  "abilities": [
    {
      "type": "Pokémon Power",
      "name": "Energy Burn",
      "effect": "As often as you like during your turn..."
    }
  ],
  "attacks": [
    {
      "cost": ["Fire", "Fire", "Fire", "Fire"],
      "name": "Fire Spin",
      "damage": 100,
      "effect": "Discard 2 Energy cards..."
    }
  ],
  "weaknesses": [{ "type": "Water", "value": "×2" }],
  "retreat": 3,
  "rarity": "Rare Holo",
  "artist": "Mitsuhiro Arita",
  "image": "https://assets.tcgdex.net/en/base/base1/4/high.webp"
}
```

## Functions in This Project

### `pokemonTcgApi.getSets()`

Fetch all sets (sorted by release date).

```typescript
const sets = await pokemonTcgApi.getSets();
// Returns: PokemonSet[]
```

### `pokemonTcgApi.getSet(setId)`

Fetch detailed information about a specific set including all cards.

```typescript
const set = await pokemonTcgApi.getSet('base1');
// Returns: DetailedSet (includes cards array)
```

### `pokemonTcgApi.getCardsFromSet(setId)`

Fetch all cards from a specific set.

```typescript
const cards = await pokemonTcgApi.getCardsFromSet('base1');
// Returns: CardSummary[]
```

### `pokemonTcgApi.getCard(cardId)`

Fetch detailed information about a single card.

```typescript
const card = await pokemonTcgApi.getCard('base1-4');
// Returns: Card (full card details)
```

### `pokemonTcgApi.searchCards(query)`

Search for cards by name.

```typescript
const cards = await pokemonTcgApi.searchCards('charizard');
// Returns: Card[]
```

## Data Structure

### PokemonSet

```typescript
{
  id: string;              // e.g., "base1"
  name: string;            // e.g., "Base Set"
  logo?: string;           // URL to set logo
  symbol?: string;         // URL to set symbol
  cardCount: {
    total: number;         // Total cards including variants
    official: number;      // Official printed number
    normal?: number;
    reverse?: number;
    holo?: number;
  };
  releaseDate?: string;    // YYYY-MM-DD format
  legal?: {
    standard: boolean;
    expanded: boolean;
  };
  serie?: {
    id: string;
    name: string;
  };
}
```

### Card (full details)

```typescript
{
  id: string;              // e.g., "base1-4"
  localId: string;         // Card number in set
  name: string;
  hp?: number;
  types?: string[];        // ["Fire", "Water", etc.]
  stage?: string;          // "Basic", "Stage 1", "Stage 2"
  evolveFrom?: string;
  abilities?: Ability[];
  attacks?: Attack[];
  weaknesses?: WeaknessResistance[];
  resistances?: WeaknessResistance[];
  retreat?: number;
  rarity?: string;
  artist?: string;
  image?: string;          // URL to card image
}
```

## Available Languages

Change the language by modifying the base URL:

- English: `/v2/en/`
- French: `/v2/fr/`
- Spanish: `/v2/es/`
- Italian: `/v2/it/`
- Portuguese: `/v2/pt/`
- German: `/v2/de/`
- Japanese: `/v2/ja/`
- Chinese: `/v2/zh/`
- Indonesian: `/v2/id/`
- Thai: `/v2/th/`

Example:

```typescript
const BASE_URL = 'https://api.tcgdex.net/v2/fr'; // French version
```

## Common Set IDs

- `base1` - Base Set
- `base2` - Jungle
- `base3` - Fossil
- `swsh1` - Sword & Shield
- `swsh3` - Darkness Ablaze
- `sv01` - Scarlet & Violet
- `sv06` - Twilight Masquerade

## Resources

- **Main Site**: https://tcgdex.dev/
- **REST API Docs**: https://tcgdex.dev/rest
- **Discord**: https://tcgdex.dev/discord
- **GitHub**: https://github.com/tcgdex/cards-database
- **Card Search**: Explore available cards at the main site

## Running the App

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Support the Project

TCGdex is a free, community-driven project. Consider supporting:

- [GitHub Sponsors](https://github.com/sponsors/tcgdex)
- Contribute to the [cards database](https://github.com/tcgdex/cards-database)
- Join the [Discord community](https://tcgdex.dev/discord)
