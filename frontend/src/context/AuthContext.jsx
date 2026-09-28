import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // Always start logged out of all accounts by default
  const [user, setUser] = useState(null);
  const [token, setToken] = useState('');

  // Clear any old auto-logged in session from previous runs
  useEffect(() => {
    localStorage.removeItem('fixconnect_user');
    localStorage.removeItem('fixconnect_token');
  }, []);

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
        return { success: true, user: data.user };
      }
      return { success: false, error: data.error || 'Invalid credentials' };
    } catch (err) {
      // Local demo fallback if backend is unreachable
      if (identifier.includes('shabber') || identifier.includes('admin')) {
        const u = { id: 1, name: 'Shabber Hussain', username: 'shabber', email: 'shabberhussain934@gmail.com', phone: '+91 98765 43210', role: 'admin' };
        setUser(u);
        return { success: true, user: u };
      } else if (identifier.includes('tech') || identifier.includes('ravi')) {
        const u = { id: 2, name: 'Ravi Sharma', username: 'ravi_sharma', email: 'ravi.tech@fixconnect.in', phone: '+91 98111 22334', role: 'technician' };
        setUser(u);
        return { success: true, user: u };
      } else {
        const u = { id: 3, name: 'Ananya Patel', username: 'ananya', email: 'ananya.p@gmail.com', phone: '+91 98220 11223', role: 'customer' };
        setUser(u);
        return { success: true, user: u };
      }
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
  };

  const switchRole = async (newRole) => {
    if (newRole === 'admin') {
      await login('shabber', '123123123');
    } else if (newRole === 'technician') {
      await login('ravi_sharma', '123123123');
    } else {
      await login('ananya', '123123123');
    }
  };

  const verifyOtp = (newUser, newToken) => {
    setUser(newUser);
    if (newToken) setToken(newToken);
  };

  const updateCurrentUser = (updatedUser) => {
    setUser(prev => ({ ...prev, ...updatedUser }));
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
