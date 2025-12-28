import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import './AuthModal.css';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'signup';
}

export const AuthModal = ({
  isOpen,
  onClose,
  initialMode = 'login',
}: AuthModalProps) => {
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login, signup } = useAuth();

  const resetForm = () => {
    setUsername('');
    setPassword('');
    setConfirmPassword('');
    setError('');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (mode === 'signup') {
        // Validation
        if (!username || !password || !confirmPassword) {
          setError('All fields are required');
          setLoading(false);
          return;
        }

        if (password !== confirmPassword) {
          setError('Passwords do not match');
          setLoading(false);
          return;
        }

        if (password.length < 6) {
          setError('Password must be at least 6 characters');
          setLoading(false);
          return;
        }

        await signup(username, password);
        handleClose();
      } else {
        // Login validation
        if (!username || !password) {
          setError('Username and password are required');
          setLoading(false);
          return;
        }

        await login(username, password);
        handleClose();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const switchMode = () => {
    setMode(mode === 'login' ? 'signup' : 'login');
    resetForm();
  };

  if (!isOpen) return null;

  return (
    <div className='auth-modal-overlay' onClick={handleClose}>
      <div className='auth-modal' onClick={(e) => e.stopPropagation()}>
        <button className='auth-modal-close' onClick={handleClose}>
          ×
        </button>

        <h2>{mode === 'login' ? 'Login' : 'Create Account'}</h2>

        <form onSubmit={handleSubmit}>
          <div className='form-group'>
            <label htmlFor='username'>Username</label>
            <input
              id='username'
              type='text'
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder={
                mode === 'login' ? 'Enter your username' : 'Choose a username'
              }
              disabled={loading}
              required
            />
          </div>

          <div className='form-group'>
            <label htmlFor='password'>Password</label>
            <input
              id='password'
              type='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder='Enter your password'
              disabled={loading}
              required
            />
          </div>

          {mode === 'signup' && (
            <div className='form-group'>
              <label htmlFor='confirmPassword'>Confirm Password</label>
              <input
                id='confirmPassword'
                type='password'
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder='Confirm your password'
                disabled={loading}
                required
              />
            </div>
          )}

          {error && <div className='error-message'>{error}</div>}

          <button type='submit' className='submit-button' disabled={loading}>
            {loading
              ? 'Please wait...'
              : mode === 'login'
              ? 'Login'
              : 'Sign Up'}
          </button>
        </form>

        <div className='auth-modal-footer'>
          {mode === 'login' ? (
            <p>
              Don't have an account?{' '}
              <button onClick={switchMode} className='link-button'>
                Sign up
              </button>
            </p>
          ) : (
            <p>
              Already have an account?{' '}
              <button onClick={switchMode} className='link-button'>
                Login
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
