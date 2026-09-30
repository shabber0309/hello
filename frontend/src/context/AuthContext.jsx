import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('fixconnect_user');
      if (!saved) return null;
      const parsed = JSON.parse(saved);
      const dummyCheck = `${parsed.username || ''} ${parsed.email || ''} ${parsed.name || ''}`.toLowerCase();
      if (
        dummyCheck.includes('shabber') ||
        dummyCheck.includes('ananya') ||
        dummyCheck.includes('ravi') ||
        dummyCheck.includes('eyeonfix.com') ||
        dummyCheck.includes('fixconnect.in')
      ) {
        localStorage.removeItem('fixconnect_user');
        localStorage.removeItem('fixconnect_token');
        localStorage.removeItem('token');
        return null;
      }
      return parsed;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState(() => {
    return localStorage.getItem('fixconnect_token') || localStorage.getItem('token') || '';
  });

  const login = async (identifier, password) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: identifier, username: identifier, password })
      });
      const data = await res.json();
      if (res.ok && data.user) {
        setUser(data.user);
        setToken(data.token);
        localStorage.setItem('fixconnect_user', JSON.stringify(data.user));
        localStorage.setItem('fixconnect_token', data.token);
        localStorage.setItem('token', data.token);
        return { success: true, user: data.user };
      }
      return { success: false, error: data.error || 'Invalid credentials' };
    } catch (err) {
      return { success: false, error: 'Could not connect to authentication server. Please check your network or server status.' };
    }
  };

  const register = async (userData) => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });
      const data = await res.json();
      if (res.ok && data.user) {
        setUser(data.user);
        setToken(data.token);
        localStorage.setItem('fixconnect_user', JSON.stringify(data.user));
        localStorage.setItem('fixconnect_token', data.token);
        localStorage.setItem('token', data.token);
        return { success: true, user: data.user };
      }
      return { success: false, error: data.error || 'Registration failed' };
    } catch (err) {
      return { success: false, error: 'Network error during registration' };
    }
  };

  const forgotPassword = async (identifier) => {
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: identifier, username: identifier })
      });
      const data = await res.json();
      if (res.ok) {
        return { success: true, data };
      }
      return { success: false, error: data.error || 'Failed to send reset code' };
    } catch (err) {
      return { success: false, error: 'Network error. Try again.' };
    }
  };

  const resetPassword = async (email, otp, newPassword) => {
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp, new_password: newPassword })
      });
      const data = await res.json();
      if (res.ok) {
        return { success: true, message: data.message };
      }
      return { success: false, error: data.error || 'Failed to reset password' };
    } catch (err) {
      return { success: false, error: 'Network error during password reset' };
    }
  };

  const logout = () => {
    setUser(null);
    setToken('');
    localStorage.removeItem('fixconnect_user');
    localStorage.removeItem('fixconnect_token');
    localStorage.removeItem('token');
  };

  const switchRole = async (newRole) => {
    // Clear credentials to allow switching accounts cleanly
    return false;
  };

  const verifyOtp = (newUser, newToken) => {
    setUser(newUser);
    if (newToken) setToken(newToken);
  };

  const updateCurrentUser = (updatedUser) => {
    setUser(prev => {
      const merged = { ...prev, ...updatedUser };
      try {
        localStorage.setItem('fixconnect_user', JSON.stringify(merged));
      } catch (e) {
        console.error('Error saving user to localStorage:', e);
      }
      return merged;
    });
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      token, 
      login, 
      register,
      forgotPassword,
      resetPassword,
      logout, 
      switchRole, 
      verifyOtp, 
      updateCurrentUser,
      isAuthenticated: !!user,
      isAdmin: user?.role === 'admin',
      isTech: user?.role === 'technician',
      isCustomer: user?.role === 'customer'
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
