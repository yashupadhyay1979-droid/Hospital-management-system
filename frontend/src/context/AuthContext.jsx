import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

// Demo users — in a real system these would come from the backend
const DEMO_USERS = [
  { username: 'admin', password: 'admin123', name: 'Dr. Admin User', role: 'System Administrator', avatar: 'AD' },
  { username: 'doctor', password: 'doctor123', name: 'Dr. Priya Sharma', role: 'Senior Physician', avatar: 'PS' },
  { username: 'nurse', password: 'nurse123', name: 'Nurse Rahul Mehta', role: 'Head Nurse', avatar: 'RM' },
];

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('aspatal_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const login = (username, password) => {
    const found = DEMO_USERS.find(
      (u) => u.username === username && u.password === password
    );
    if (found) {
      const { password: _, ...safeUser } = found;
      setUser(safeUser);
      localStorage.setItem('aspatal_user', JSON.stringify(safeUser));
      return { success: true };
    }
    return { success: false, error: 'Invalid credentials. Please try again.' };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('aspatal_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
