import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

interface User {
  id: string;
  username: string;
}

interface StoredUser extends User {
  password: string;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<void>;
  signup: (username: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(() => {
    // Load user from localStorage on mount
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const signup = async (username: string, password: string) => {
    // Get existing users from localStorage
    const usersData = localStorage.getItem('users');
    const users: StoredUser[] = usersData ? JSON.parse(usersData) : [];

    // Check if username already exists
    const existingUserByUsername = users.find((u) => u.username === username);
    if (existingUserByUsername) {
      throw new Error('Username is already taken');
    }

    // Create new user
    const newUser = {
      id: Date.now().toString(),
      username,
      password, // In a real app, this should be hashed
    };

    // Save to users array
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));

    // Set current user (without password)
    const userWithoutPassword = {
      id: newUser.id,
      username: newUser.username,
    };
    setUser(userWithoutPassword);
    localStorage.setItem('user', JSON.stringify(userWithoutPassword));
  };

  const login = async (username: string, password: string) => {
    // Get users from localStorage
    const usersData = localStorage.getItem('users');
    const users: StoredUser[] = usersData ? JSON.parse(usersData) : [];

    // Find user by username
    const foundUser = users.find(
      (u) => u.username === username && u.password === password
    );

    if (!foundUser) {
      throw new Error('Invalid username or password');
    }

    // Set current user (without password)
    const userWithoutPassword = {
      id: foundUser.id,
      username: foundUser.username,
    };
    setUser(userWithoutPassword);
    localStorage.setItem('user', JSON.stringify(userWithoutPassword));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const value = {
    user,
    login,
    signup,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
