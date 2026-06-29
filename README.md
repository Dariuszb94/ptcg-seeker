# Pokemon TCG Seeker 🎴

A modern web application for managing your Pokemon Trading Card Game collection. Track your cards, build wishlists, and discover amazing Pokemon cards from every set.

## Features

- 🔍 **Search & Browse** - Explore all Pokemon TCG sets with an intuitive search interface
- 📚 **Collection Management** - Track which cards you own with persistent storage
- ❤️ **Wishlist** - Create and share wishlists of cards you're hunting for
- 📱 **Responsive Design** - Beautiful, modern interface that works on all devices
- 🎨 **High Contrast** - Accessible design with excellent text readability

## Tech Stack

- **React 19** with TypeScript
- **Vite** for fast development and optimized builds
- **TCGdex API** for Pokemon card data
- **Lucide React** for icons
- **Local Storage** for data persistence

## Development

### Prerequisites

- Node.js 18+ and npm

### Installation

```bash
# Clone the repository
git clone https://github.com/Dariuszb94/ptcg-seeker.git

# Navigate to project directory
cd ptcg-seeker

# Install dependencies
npm install

# Start development server
npm run dev
```

### Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build locally
npm run lint     # Run ESLint
npm run deploy   # Deploy to GitHub Pages
```

## Deployment

This app is configured for GitHub Pages deployment.

### Deploy to GitHub Pages

```bash
# Build and deploy in one command
npm run deploy
```

The app will be available at: `https://Dariuszb94.github.io/ptcg-seeker`

### Manual Deployment Steps

1. Ensure you have the `gh-pages` package installed (already included)
2. Run `npm run build` to create the production build
3. Run `npm run deploy` to publish to GitHub Pages
4. Go to your repository settings → Pages and ensure the source is set to `gh-pages` branch

## Configuration

The app uses the following configuration for GitHub Pages:

- **Base path**: `/ptcg-seeker/` (configured in `vite.config.ts`)
- **Homepage**: Set in `package.json`
- **Client-side routing**: Supported via 404.html redirect strategy

## API

This project uses the [TCGdex API](https://tcgdex.dev/) to fetch Pokemon card data. No API key required.

## License

This project is open source and available under the MIT License.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
