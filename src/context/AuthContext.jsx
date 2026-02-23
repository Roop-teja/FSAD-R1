import { createContext, useContext, useState, useEffect } from 'react';
import { useData } from './DataContext';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const { students, admin } = useData();
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for stored auth data on mount
    const storedUser = localStorage.getItem('educonnect_user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  const login = (email, password, role) => {
    if (role === 'admin') {
      if (email === admin.email && password === admin.password) {
        const adminUser = { ...admin, role: 'admin' };
        setUser(adminUser);
        setIsAuthenticated(true);
        localStorage.setItem('educonnect_user', JSON.stringify(adminUser));
        return { success: true, user: adminUser };
      }
      return { success: false, error: 'Invalid admin credentials' };
    } else {
      const student = students.find(s => s.email === email && s.password === password);
      if (student) {
        const studentUser = { ...student, role: 'student' };
        setUser(studentUser);
        setIsAuthenticated(true);
        localStorage.setItem('educonnect_user', JSON.stringify(studentUser));
        return { success: true, user: studentUser };
      }
      return { success: false, error: 'Invalid student credentials' };
    }
  };

  const register = (userData) => {
    // In a real app, this would create a new student in the database
    const newStudent = {
      id: Date.now(),
      ...userData,
      enrolledCourses: [],
      completedLessons: [],
      role: 'student',
      joinDate: new Date().toISOString().split('T')[0]
    };
    
    const studentUser = { ...newStudent, role: 'student' };
    setUser(studentUser);
    setIsAuthenticated(true);
    localStorage.setItem('educonnect_user', JSON.stringify(studentUser));
    return { success: true, user: studentUser };
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('educonnect_user');
  };

  const updateProfile = (updatedData) => {
    const updatedUser = { ...user, ...updatedData };
    setUser(updatedUser);
    localStorage.setItem('educonnect_user', JSON.stringify(updatedUser));
    return updatedUser;
  };

  const isAdmin = () => {
    return user?.role === 'admin';
  };

  const isStudent = () => {
    return user?.role === 'student';
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    register,
    logout,
    updateProfile,
    isAdmin,
    isStudent
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;