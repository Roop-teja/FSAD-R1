import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { FiMail, FiLock, FiBook } from 'react-icons/fi';
import './Auth.css';

const Login = () => {
  const [role, setRole] = useState('student');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Demo credentials
    const demoCredentials = {
      admin: { email: 'admin@educonnect.com', password: 'admin123' },
      student: { email: 'alex@student.com', password: 'student123' }
    };

    // Auto-fill demo credentials if fields are empty
    const loginEmail = email || demoCredentials[role].email;
    const loginPassword = password || demoCredentials[role].password;

    const result = login(loginEmail, loginPassword, role);
    
    setTimeout(() => {
      setLoading(false);
      if (result.success) {
        navigate(role === 'admin' ? '/admin/dashboard' : '/student/dashboard');
      } else {
        setError(result.error);
      }
    }, 1000);
  };

  return (
    <div className="auth-container">
      <div className="auth-left">
        <div className="auth-brand">
          <div className="brand-icon">
            <FiBook />
          </div>
          <h1>EduConnect</h1>
          <p>Online Course Management System</p>
        </div>
        <div className="auth-illustration">
          <img 
            src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600" 
            alt="Education Illustration"
          />
        </div>
        <div className="auth-features">
          <div className="feature-item">
            <span className="feature-icon">📚</span>
            <span>Create & Manage Courses</span>
          </div>
          <div className="feature-item">
            <span className="feature-icon">👥</span>
            <span>Track Student Progress</span>
          </div>
          <div className="feature-item">
            <span className="feature-icon">📝</span>
            <span>Assignments & Grading</span>
          </div>
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-form-container">
          <div className="auth-header">
            <h2>Welcome Back!</h2>
            <p>Login to continue your learning journey</p>
          </div>

          {/* Role Selection */}
          <div className="role-selector">
            <button
              type="button"
              className={`role-btn ${role === 'student' ? 'active' : ''}`}
              onClick={() => setRole('student')}
            >
              <span className="role-icon">👨‍🎓</span>
              <span>Student</span>
            </button>
            <button
              type="button"
              className={`role-btn ${role === 'admin' ? 'active' : ''}`}
              onClick={() => setRole('admin')}
            >
              <span className="role-icon">👨‍🏫</span>
              <span>Educator</span>
            </button>
          </div>

          {error && <div className="auth-error">{error}</div>}

          <form onSubmit={handleSubmit} className="auth-form">
            <Input
              type="email"
              label="Email Address"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={role === 'admin' ? 'admin@educonnect.com' : 'alex@student.com'}
              icon={<FiMail />}
            />

            <Input
              type="password"
              label="Password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              icon={<FiLock />}
            />

            <div className="auth-options">
              <label className="remember-me">
                <input type="checkbox" />
                <span>Remember me</span>
              </label>
              <Link to="/forgot-password" className="forgot-link">
                Forgot Password?
              </Link>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="large"
              fullWidth
              loading={loading}
            >
              Sign In
            </Button>
          </form>

          <div className="auth-footer">
            <p>
              Don't have an account?{' '}
              <Link to="/register" className="auth-link">
                Create Account
              </Link>
            </p>
          </div>

          <div className="demo-credentials">
            <p>Demo Credentials:</p>
            <p><strong>Admin:</strong> admin@educonnect.com / admin123</p>
            <p><strong>Student:</strong> alex@student.com / student123</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;