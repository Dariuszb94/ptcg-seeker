import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { AuthModal } from './AuthModal';
import './Header.css';

export const Header = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node)
      ) {
        setShowUserMenu(false);
      }
    };

    if (showUserMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showUserMenu]);

  const handleLoginClick = () => {
    setAuthMode('login');
    setShowAuthModal(true);
  };

  const handleSignupClick = () => {
    setAuthMode('signup');
    setShowAuthModal(true);
  };

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
  };

  return (
    <>
      <header className='app-header'>
        <div className='header-content'>
          <div className='header-title'>
            <h1>Pokemon TCG Card Selector</h1>
          </div>

          <div className='header-auth'>
            {isAuthenticated ? (
              <div className='user-menu-container' ref={userMenuRef}>
                <button
                  className='user-button'
                  onClick={() => setShowUserMenu(!showUserMenu)}
                >
                  <span className='user-icon'>👤</span>
                  <span className='user-name'>{user?.username}</span>
                  <span className='dropdown-arrow'>▼</span>
                </button>

                {showUserMenu && (
                  <div className='user-dropdown'>
                    <div className='user-info'>
                      <div className='user-info-name'>{user?.username}</div>
                    </div>
                    <div className='user-dropdown-divider'></div>
                    <button onClick={handleLogout} className='logout-button'>
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className='auth-buttons'>
                <button onClick={handleLoginClick} className='login-button'>
                  Login
                </button>
                <button onClick={handleSignupClick} className='signup-button'>
                  Sign Up
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        initialMode={authMode}
      />
    </>
  );
};
