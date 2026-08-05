import styled from 'styled-components';
import { BookMarked, Heart } from 'lucide-react';
import { AppLogo } from './AppLogo';

const HeaderContainer = styled.header`
  position: sticky;
  top: 0;
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0.02),
    var(--surface)
  );
  backdrop-filter: blur(8px);
  border-bottom: 1px solid rgba(100, 108, 255, 0.12);
  padding: 0.75rem 1rem;
  z-index: 100;
  box-shadow: var(--shadow-sm);
`;

const HeaderContent = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  padding: 0 0.5rem;

  @media (max-width: 768px) {
    padding: 0 0.5rem;
  }
`;

const LogoButton = styled.button`
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  box-shadow: none;

  &:hover {
    transform: none;
    box-shadow: none;
  }
`;

const Nav = styled.nav`
  display: flex;
  gap: 1rem;
  align-items: center;
`;

const NavButton = styled.button<{ $isActive?: boolean; $activeColor?: string }>`
  padding: 0.5rem 1rem;
  background-color: ${(props) =>
    props.$isActive ? props.$activeColor : '#444'};
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1rem;
  transition:
    background-color 0.2s,
    transform 220ms ease;
  box-shadow: var(--shadow-sm);

  &:hover {
    background-color: ${(props) =>
      props.$isActive ? props.$activeColor : '#555'};
    transform: translateY(-2px);
  }

  @media (max-width: 768px) {
    padding: 0.5rem 1rem;
    font-size: 0.9rem;
  }
`;

interface HeaderProps {
  onNavigate?: (view: 'home' | 'collection' | 'wishlist') => void;
  currentView?: 'home' | 'collection' | 'wishlist';
}

export const Header = ({ onNavigate, currentView = 'home' }: HeaderProps) => {
  return (
    <HeaderContainer role='banner'>
      <HeaderContent>
        <LogoButton
          onClick={() => onNavigate?.('home')}
          aria-label='Go to home page'
        >
          <AppLogo />
        </LogoButton>
        <Nav role='navigation' aria-label='Main navigation'>
          {onNavigate && (
            <>
              <NavButton
                onClick={() => onNavigate('collection')}
                aria-label='View your collection'
                aria-current={currentView === 'collection' ? 'page' : undefined}
                $isActive={currentView === 'collection'}
                $activeColor='#4CAF50'
              >
                <BookMarked size={20} aria-hidden='true' />
                Collection
              </NavButton>
              <NavButton
                onClick={() => onNavigate('wishlist')}
                aria-label='View your wishlist'
                aria-current={currentView === 'wishlist' ? 'page' : undefined}
                $isActive={currentView === 'wishlist'}
                $activeColor='#FF4081'
              >
                <Heart size={20} aria-hidden='true' />
                Wishlist
              </NavButton>
            </>
          )}
        </Nav>
      </HeaderContent>
    </HeaderContainer>
  );
};
