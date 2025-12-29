import './Header.css';
import { BookMarked, Heart } from 'lucide-react';
import { PokemonLogo } from './PokemonLogo';
import { AppLogo } from './AppLogo';

interface HeaderProps {
  onNavigate?: (view: 'home' | 'collection' | 'wishlist') => void;
  currentView?: 'home' | 'collection' | 'wishlist';
}

export const Header = ({ onNavigate, currentView = 'home' }: HeaderProps) => {
  return (
    <header className='app-header'>
      <div className='header-content'>
        <div onClick={() => onNavigate?.('home')}>
          <AppLogo />
        </div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          {onNavigate && (
            <>
              <button
                onClick={() => onNavigate('collection')}
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor:
                    currentView === 'collection' ? '#4CAF50' : '#444',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontSize: '1rem',
                  transition: 'background-color 0.2s',
                }}
                onMouseEnter={(e) => {
                  if (currentView !== 'collection') {
                    e.currentTarget.style.backgroundColor = '#555';
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor =
                    currentView === 'collection' ? '#4CAF50' : '#444';
                }}
              >
                <BookMarked size={20} />
                Collection
              </button>
              <button
                onClick={() => onNavigate('wishlist')}
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor:
                    currentView === 'wishlist' ? '#FF4081' : '#444',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontSize: '1rem',
                  transition: 'background-color 0.2s',
                }}
                onMouseEnter={(e) => {
                  if (currentView !== 'wishlist') {
                    e.currentTarget.style.backgroundColor = '#555';
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor =
                    currentView === 'wishlist' ? '#FF4081' : '#444';
                }}
              >
                <Heart size={20} />
                Wishlist
              </button>
            </>
          )}
          <div
            style={{
              marginLeft: '0.5rem',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <PokemonLogo size={45} />
          </div>
        </div>
      </div>
    </header>
  );
};
