# Pokémon TCG API Integration Guide

This project uses the [Pokémon TCG API](https://pokemontcg.io/) to fetch real-time data about Pokémon Trading Card Game sets and cards.

## API Overview

- **Base URL**: `https://api.pokemontcg.io/v2`
- **Documentation**: https://docs.pokemontcg.io/
- **Rate Limits**:
  - Without API Key: 20,000 requests/day
  - With API Key: 100,000 requests/day (free)

## Getting an API Key (Optional but Recommended)

1. Visit https://dev.pokemontcg.io/
2. Sign up for a free account
3. Copy your API key
4. Add it to `/src/services/pokemon-tcg-api.ts`:

```typescript
const API_KEY = 'your-api-key-here';
```

## Available Functions

### `pokemonTcgApi.getSets()`

Fetch all Pokémon TCG sets.

```typescript
const response = await pokemonTcgApi.getSets();
console.log(response.data); // Array of PokemonSet objects
```

**Parameters:**

- `page` (optional): Page number (default: 1)
- `pageSize` (optional): Sets per page (default: 250, max: 250)
- `orderBy` (optional): Sort field (default: '-releaseDate' for newest first)

### `pokemonTcgApi.getSet(setId)`

Fetch a specific set by ID.

```typescript
const response = await pokemonTcgApi.getSet('base1');
console.log(response.data); // Single PokemonSet object
```

### `pokemonTcgApi.searchSets(query)`

Search for sets with a query.

```typescript
// Find sets with "Sword" in the name
const response = await pokemonTcgApi.searchSets('name:Sword');

// Find sets in a specific series
const response = await pokemonTcgApi.searchSets('series:"Sword & Shield"');
```

### `pokemonTcgApi.getCardsFromSet(setId)`

Get all cards from a specific set.

```typescript
const response = await pokemonTcgApi.getCardsFromSet('base1');
console.log(response.data); // Array of Card objects
```

### `pokemonTcgApi.searchCards(query)`

Search for specific cards.

```typescript
// Find Charizard cards
const response = await pokemonTcgApi.searchCards('name:charizard');

// Find Fire-type cards
const response = await pokemonTcgApi.searchCards('types:fire');

// Advanced query
const response = await pokemonTcgApi.searchCards('name:pikachu types:electric');
```

## Query Syntax Examples

The API supports advanced Lucene-like query syntax:

- **Exact match**: `name:"Sword & Shield"`
- **Wildcard**: `name:char*` (matches Charizard, Charmander, etc.)
- **OR operator**: `name:pikachu OR name:raichu`
- **AND operator**: `name:charizard types:fire`
- **NOT operator**: `name:pikachu -supertype:trainer`
- **Range**: `hp:[100 TO 200]`
- **Greater than**: `hp:>=100`
- **Less than**: `hp:<=100`

### Common Query Fields

**For Sets:**

- `name`: Set name
- `series`: Set series
- `legalities.standard`: Legal/Banned
- `legalities.expanded`: Legal/Banned
- `releaseDate`: Date in YYYY/MM/DD format

**For Cards:**

- `name`: Card name
- `types`: Card types (fire, water, grass, etc.)
- `supertype`: Pokémon, Trainer, Energy
- `subtypes`: Basic, Stage 1, Stage 2, EX, V, VMAX, etc.
- `hp`: Hit points
- `rarity`: Common, Uncommon, Rare, etc.
- `set.id`: Set ID
- `set.name`: Set name
- `artist`: Card artist name
- `nationalPokedexNumbers`: Pokédex number

## Example Queries

```typescript
// Get all VMAX Pokémon
await pokemonTcgApi.searchCards('subtypes:vmax');

// Get all cards from Base Set
await pokemonTcgApi.getCardsFromSet('base1');

// Get rare Charizard cards
await pokemonTcgApi.searchCards('name:charizard rarity:rare');

// Get all Fire-type Pokémon with HP >= 200
await pokemonTcgApi.searchCards('types:fire hp:>=200');

// Get all sets released in 2023
await pokemonTcgApi.searchSets('releaseDate:[2023/01/01 TO 2023/12/31]');

// Get all Standard-legal sets
await pokemonTcgApi.searchSets('legalities.standard:legal');
```

## Data Structure

### PokemonSet

```typescript
{
  id: string;              // e.g., "base1"
  name: string;            // e.g., "Base Set"
  series: string;          // e.g., "Base"
  printedTotal: number;    // Cards printed on the set
  total: number;           // Total cards including secret rares
  legalities: {
    unlimited?: string;
    standard?: string;
    expanded?: string;
  };
  releaseDate: string;     // YYYY/MM/DD
  images: {
    symbol: string;        // URL to set symbol
    logo: string;          // URL to set logo
  };
}
```

### Card (simplified)

```typescript
{
  id: string;
  name: string;
  supertype: string;       // "Pokémon", "Trainer", "Energy"
  subtypes?: string[];     // ["Basic", "V", "VMAX", etc.]
  hp?: string;
  types?: string[];        // ["Fire", "Water", etc.]
  set: PokemonSet;
  number: string;          // Card number in set
  artist?: string;
  rarity?: string;
  images: {
    small: string;         // Small image URL
    large: string;         // Large/hi-res image URL
  };
}
```

## Running the App

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Resources

- **API Documentation**: https://docs.pokemontcg.io/
- **Main Website**: https://pokemontcg.io/
- **Developer Portal**: https://dev.pokemontcg.io/
- **Discord Community**: https://discord.gg/dpsTCvg
- **Card Search Engine**: https://pokemontcg.guru/

## Support the API

The Pokémon TCG API is a free, community-driven project. Consider supporting:

- [Patreon](https://www.patreon.com/pokemon_tcg_api)
- [Ko-fi](https://ko-fi.com/pokemontcg)
