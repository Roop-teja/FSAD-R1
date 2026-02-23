import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { FiMail, FiLock, FiUser, FiBook } from 'react-icons/fi';
import './Auth.css';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    
    const result = register({
      name: formData.name,
      email: formData.email,
      password: formData.password,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.name)}&background=4f46e5&color=fff`
    });
    
    setTimeout(() => {
      setLoading(false);
      if (result.success) {
        navigate('/student/dashboard');
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
            src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=600" 
            alt="Learning Illustration"
          />
        </div>
        <div className="auth-features">
          <div className="feature-item">
            <span className="feature-icon">🎯</span>
            <span>Personalized Learning</span>
          </div>
          <div className="feature-item">
            <span className="feature-icon">📊</span>
            <span>Track Your Progress</span>
          </div>
          <div className="feature-item">
            <span className="feature-icon">🏆</span>
            <span>Earn Certificates</span>
          </div>
        </div>
      </div>

      <div className="auth-right">
        <div className="auth-form-container">
          <div className="auth-header">
            <h2>Create Account</h2>
            <p>Start your learning journey today</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            <Input
              type="text"
              label="Full Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              icon={<FiUser />}
              error={errors.name}
            />

            <Input
              type="email"
              label="Email Address"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              icon={<FiMail />}
              error={errors.email}
            />

            <Input
              type="password"
              label="Password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Create a password"
              icon={<FiLock />}
              error={errors.password}
            />

            <Input
              type="password"
              label="Confirm Password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm your password"
              icon={<FiLock />}
              error={errors.confirmPassword}
            />

            <div className="terms-checkbox">
              <label className="remember-me">
                <input type="checkbox" required />
                <span>I agree to the <Link to="/terms">Terms of Service</Link> and <Link to="/privacy">Privacy Policy</Link></span>
              </label>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="large"
              fullWidth
              loading={loading}
            >
              Create Account
            </Button>
          </form>

          <div className="auth-divider">
            <span>or continue with</span>
          </div>

          <div className="social-login">
            <button className="social-btn">
              <span>🔵</span> Google
            </button>
            <button className="social-btn">
              <span>📘</span> Facebook
            </button>
          </div>

          <div className="auth-footer">
            <p>
              Already have an account?{' '}
              <Link to="/login" className="auth-link">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;