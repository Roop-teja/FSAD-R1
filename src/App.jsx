import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { DataProvider } from './context/DataContext';
import { AuthProvider, useAuth } from './context/AuthContext';

// Layout
import DashboardLayout from './components/layout/DashboardLayout';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';
import AdminCourses from './pages/admin/Courses';
import CreateCourse from './pages/admin/CreateCourse';
import AdminAssignments from './pages/admin/Assignments';
import AdminStudents from './pages/admin/Students';
import AdminSettings from './pages/admin/Settings';

// Student Pages
import StudentDashboard from './pages/student/Dashboard';
import BrowseCourses from './pages/student/BrowseCourses';
import CourseLearning from './pages/student/CourseLearning';
import StudentAssignments from './pages/student/StudentAssignments';

import './App.css';

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) {
    return <div className="loading-screen">Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to={user?.role === 'admin' ? '/admin/dashboard' : '/student/dashboard'} replace />;
  }

  return children;
};

// Public Route Component (redirects authenticated users)
const PublicRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuth();

  if (isAuthenticated) {
    return <Navigate to={user?.role === 'admin' ? '/admin/dashboard' : '/student/dashboard'} replace />;
  }

  return children;
};

function App() {
  return (
    <DataProvider>
      <AuthProvider>
        <Router>
          <div className="app">
            <Routes>
              {/* Public Routes */}
              <Route
                path="/login"
                element={
                  <PublicRoute>
                    <Login />
                  </PublicRoute>
                }
              />
              <Route
                path="/register"
                element={
                  <PublicRoute>
                    <Register />
                  </PublicRoute>
                }
              />

              {/* Admin Routes */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute allowedRoles={['admin']}>
                    <DashboardLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<Navigate to="dashboard" replace />} />
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="courses" element={<AdminCourses />} />
                <Route path="create-course" element={<CreateCourse />} />
                <Route path="edit-course/:id" element={<CreateCourse />} />
                <Route path="course/:id" element={<AdminCourses />} />
                <Route path="content" element={<AdminCourses />} />
                <Route path="assignments" element={<AdminAssignments />} />
                <Route path="students" element={<AdminStudents />} />
                <Route path="progress" element={<AdminStudents />} />
                <Route path="settings" element={<AdminSettings />} />
              </Route>

              {/* Student Routes */}
              <Route
                path="/student"
                element={
                  <ProtectedRoute allowedRoles={['student']}>
                    <DashboardLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<Navigate to="dashboard" replace />} />
                <Route path="dashboard" element={<StudentDashboard />} />
                <Route path="courses" element={<StudentDashboard />} />
                <Route path="browse" element={<BrowseCourses />} />
                <Route path="course/:id" element={<CourseLearning />} />
                <Route path="assignments" element={<StudentAssignments />} />
                <Route path="assignment/:id" element={<StudentAssignments />} />
                <Route path="certificates" element={<StudentDashboard />} />
                <Route path="settings" element={<AdminSettings />} />
              </Route>

              {/* Default Routes */}
              <Route path="/" element={<Navigate to="/login" replace />} />
              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
          </div>
        </Router>
      </AuthProvider>
    </DataProvider>
  );
}

export default App;