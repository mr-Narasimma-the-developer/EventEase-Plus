import React, { createContext, useState, useEffect } from 'react';
import API from '../utils/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load user from localStorage on mount
    const loadUser = () => {
      try {
        const storedToken = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user');

        console.log('Loading auth from localStorage...');
        console.log('Stored token:', storedToken ? 'exists' : 'none');
        console.log('Stored user:', storedUser);

        if (storedToken && storedUser) {
          const parsedUser = JSON.parse(storedUser);
          
          // CRITICAL FIX: Ensure role is set
          if (!parsedUser.role) {
            console.error('User object missing role!');
            logout();
            return;
          }

          setToken(storedToken);
          setUser(parsedUser);
          
          // Set token in API headers
          API.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
          
          console.log('User loaded successfully:', parsedUser.email, 'Role:', parsedUser.role);
        } else {
          console.log('No stored auth found');
        }
      } catch (error) {
        console.error('Error loading user from storage:', error);
        logout();
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const login = (newToken, userData) => {
    console.log('Login called with:', { email: userData.email, role: userData.role });
    
    // CRITICAL FIX: Validate user data
    if (!userData || !userData.role) {
      console.error('Invalid user data in login:', userData);
      return false;
    }

    try {
      // Store in localStorage
      localStorage.setItem('token', newToken);
      localStorage.setItem('user', JSON.stringify(userData));

      // Update state
      setToken(newToken);
      setUser(userData);

      // Set token in API headers
      API.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;

      console.log('Login successful. User role:', userData.role);
      return true;
    } catch (error) {
      console.error('Error during login:', error);
      return false;
    }
  };

  const logout = () => {
    console.log('Logout called');
    
    // Clear localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    // Clear state
    setToken(null);
    setUser(null);

    // Remove token from API headers
    delete API.defaults.headers.common['Authorization'];

    console.log('Logout complete');
  };

  const updateUser = (userData) => {
    console.log('Updating user data:', userData);
    
    // CRITICAL FIX: Preserve role when updating
    const updatedUser = {
      ...user,
      ...userData,
      role: userData.role || user?.role // Ensure role is never lost
    };

    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
    
    console.log('User updated. Current role:', updatedUser.role);
  };

  // CRITICAL: Log current auth state for debugging
  useEffect(() => {
    if (user) {
      console.log('Current user:', {
        name: user.name,
        email: user.email,
        role: user.role,
        _id: user._id
      });
    }
  }, [user]);

  const value = {
    user,
    token,
    loading,
    login,
    logout,
    updateUser,
    isAuthenticated: !!token && !!user,
    isAdmin: user?.role === 'admin',
    isOrganizer: user?.role === 'organizer',
    isVendor: user?.role === 'vendor',
    isParticipant: user?.role === 'participant'
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};