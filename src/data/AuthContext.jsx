import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  // Giả lập Database Users
  const [users, setUsers] = useState(() => {
    const saved = localStorage.getItem('saas_users');
    return saved ? JSON.parse(saved) : [];
  });

  // Current Logged In User
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('saas_current_user');
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    localStorage.setItem('saas_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('saas_current_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('saas_current_user');
    }
  }, [currentUser]);

  const register = async (name, email, password, storeName, subdomain) => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, storeName, subdomain })
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, message: data.message || 'Đăng ký thất bại' };
      }
      return { success: true };
    } catch (err) {
      console.error(err);
      return { success: false, message: 'Lỗi kết nối mạng' };
    }
  };

  const login = async (email, password) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, message: data.message || 'Đăng nhập thất bại' };
      }
      
      // Lưu Token vào localStorage
      localStorage.setItem('saas_auth_token', data.token);
      setCurrentUser(data.user);
      return { success: true };
    } catch (err) {
      console.error(err);
      return { success: false, message: 'Lỗi kết nối mạng' };
    }
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('saas_auth_token');
    window.location.href = '/';
  };

  return (
    <AuthContext.Provider value={{ users, currentUser, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
