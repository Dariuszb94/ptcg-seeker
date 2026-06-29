import { BookMarked, Heart, Search } from 'lucide-react';

export function HeroSection() {
  return (
    <div
      style={{
        padding: '2rem 1.5rem 3rem',
        maxWidth: '1200px',
        margin: '0 auto',
      }}
    >
      {/* Hero Content */}
      <div
        style={{
          textAlign: 'center',
          marginBottom: '3rem',
        }}
      >
        <h1
          style={{
            fontSize: 'clamp(2rem, 5vw, 3.5rem)',
            fontWeight: '800',
            marginBottom: '1rem',
            color: '#f8f9fa',
            lineHeight: '1.2',
          }}
        >
          Your Ultimate Pokemon TCG Collection Manager
        </h1>
        <p
          style={{
            fontSize: 'clamp(1rem, 2.5vw, 1.25rem)',
            color: '#e8e8f2',
            maxWidth: '700px',
            margin: '0 auto 2rem',
            lineHeight: '1.6',
          }}
        >
          Track your collection, build your wishlist, and discover amazing
          Pokemon cards from every set
        </p>
      </div>

      {/* Features Section */}
      <div
        style={{
          marginTop: '3rem',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '2rem',
          maxWidth: '1000px',
          margin: '3rem auto 0',
        }}
      >
        <div
          style={{
            padding: '2rem',
            backgroundColor: 'rgba(42, 42, 62, 0.8)',
            backdropFilter: 'blur(10px)',
            borderRadius: '16px',
            border: '1px solid rgba(100, 108, 255, 0.3)',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              display: 'inline-flex',
              padding: '1rem',
              backgroundColor: 'rgba(76, 175, 80, 0.25)',
              borderRadius: '12px',
              marginBottom: '1rem',
            }}
          >
            <BookMarked size={32} color='#5FD068' aria-hidden='true' />
          </div>
          <h3
            style={{
              fontSize: '1.25rem',
              fontWeight: '600',
              marginBottom: '0.5rem',
              color: '#ffffff',
            }}
          >
            Track Your Collection
          </h3>
          <p style={{ color: '#d4d4e8', lineHeight: '1.6' }}>
            Keep track of all your Pokemon cards organized by set and rarity
          </p>
        </div>

        <div
          style={{
            padding: '2rem',
            backgroundColor: 'rgba(42, 42, 62, 0.8)',
            backdropFilter: 'blur(10px)',
            borderRadius: '16px',
            border: '1px solid rgba(100, 108, 255, 0.3)',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              display: 'inline-flex',
              padding: '1rem',
              backgroundColor: 'rgba(255, 64, 129, 0.25)',
              borderRadius: '12px',
              marginBottom: '1rem',
            }}
          >
            <Heart size={32} color='#FF6B9D' aria-hidden='true' />
          </div>
          <h3
            style={{
              fontSize: '1.25rem',
              fontWeight: '600',
              marginBottom: '0.5rem',
              color: '#ffffff',
            }}
          >
            Build Your Wishlist
          </h3>
          <p style={{ color: '#d4d4e8', lineHeight: '1.6' }}>
            Create and share wishlists of cards you're hunting for
          </p>
        </div>

        <div
          style={{
            padding: '2rem',
            backgroundColor: 'rgba(42, 42, 62, 0.8)',
            backdropFilter: 'blur(10px)',
            borderRadius: '16px',
            border: '1px solid rgba(100, 108, 255, 0.3)',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              display: 'inline-flex',
              padding: '1rem',
              backgroundColor: 'rgba(100, 108, 255, 0.25)',
              borderRadius: '12px',
              marginBottom: '1rem',
            }}
          >
            <Search size={32} color='#7B8CFF' aria-hidden='true' />
          </div>
          <h3
            style={{
              fontSize: '1.25rem',
              fontWeight: '600',
              marginBottom: '0.5rem',
              color: '#ffffff',
            }}
          >
            Explore All Sets
          </h3>
          <p style={{ color: '#d4d4e8', lineHeight: '1.6' }}>
            Browse through every Pokemon TCG set ever released
          </p>
        </div>
      </div>
    </div>
  );
}
