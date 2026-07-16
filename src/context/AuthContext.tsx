import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Teacher = {
  id: string;
  name: string;
  email: string;
};

type AuthContextType = {
  isAuthenticated: boolean;
  teacher: Teacher | null;
  loading: boolean;
  login: (token: string, teacherData: Teacher) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [teacher, setTeacher] = useState<Teacher | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Check localStorage for token on app load
    const token = localStorage.getItem('authToken');
    const storedTeacher = localStorage.getItem('teacherInfo');
    
    if (token) {
      setIsAuthenticated(true);
      if (storedTeacher) {
        try {
          setTeacher(JSON.parse(storedTeacher));
        } catch (e) {
          console.error("Failed to parse teacher data", e);
        }
      }
    }
    setLoading(false);
  }, []);

  const login = (token: string, teacherData: Teacher) => {
    localStorage.setItem('authToken', token);
    localStorage.setItem('teacherInfo', JSON.stringify(teacherData));
    setIsAuthenticated(true);
    setTeacher(teacherData);
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('teacherInfo');
    setIsAuthenticated(false);
    setTeacher(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, teacher, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
