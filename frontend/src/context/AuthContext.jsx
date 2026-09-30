import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('livefix_user') || localStorage.getItem('fixconnect_user');
      if (!saved) return null;
      const parsed = JSON.parse(saved);
      return parsed && typeof parsed === 'object' && (parsed.id || parsed.email || parsed.username || parsed.name) ? parsed : null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState(() => {
    try {
      return localStorage.getItem('livefix_token') || localStorage.getItem('fixconnect_token') || localStorage.getItem('token') || '';
    } catch {
      return '';
    }
  });

  const login = async (identifier, password) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, email: identifier, phone: identifier, username: identifier, password })
      });
      const data = await res.json();
      if (res.ok && data.user) {
        setUser(data.user);
        setToken(data.token);
        localStorage.setItem('livefix_user', JSON.stringify(data.user));
        localStorage.setItem('livefix_token', data.token);
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
        localStorage.setItem('livefix_user', JSON.stringify(data.user));
        localStorage.setItem('livefix_token', data.token);
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
        body: JSON.stringify({ identifier, email: identifier, phone: identifier, username: identifier })
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

  const resetPassword = async (emailOrPhone, otp, newPassword) => {
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: emailOrPhone, email: emailOrPhone, phone: emailOrPhone, otp, new_password: newPassword })
      });
      const data = await res.json();
      if (res.ok) {
        return { success: true, message: data.message, user: data.user };
      }
      return { success: false, error: data.error || 'Failed to reset password' };
    } catch (err) {
      return { success: false, error: 'Network error during password reset' };
    }
  };

  const sendOtp = async (email, role = 'customer') => {
    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, role })
      });
      const data = await res.json();
      if (res.ok) {
        return { success: true, data };
      }
      return { success: false, error: data.error || 'Failed to send OTP code' };
    } catch (err) {
      return { success: false, error: 'Network error. Could not send verification code.' };
    }
  };

  const loginWithOtp = async (email, otp, role = 'customer') => {
    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp, role })
      });
      const data = await res.json();
      if (res.ok && data.user) {
        setUser(data.user);
        setToken(data.token);
        localStorage.setItem('livefix_user', JSON.stringify(data.user));
        localStorage.setItem('livefix_token', data.token);
        localStorage.setItem('token', data.token);
        return { success: true, user: data.user };
      }
      return { success: false, error: data.error || 'Invalid or expired verification code' };
    } catch (err) {
      return { success: false, error: 'Network error during code verification' };
    }
  };

  const logout = () => {
    setUser(null);
    setToken('');
    localStorage.removeItem('livefix_user');
    localStorage.removeItem('livefix_token');
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
        localStorage.setItem('livefix_user', JSON.stringify(merged));
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
      sendOtp,
      loginWithOtp,
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
