import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import {
  FiSave,
  FiX,
  FiUpload,
  FiDollarSign,
  FiClock,
  FiUser
} from 'react-icons/fi';
import './CreateCourse.css';

const CreateCourse = () => {
  const { addCourse } = useData();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Web Development',
    level: 'Beginner',
    duration: '',
    price: '',
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400'
  });
  
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const categories = [
    'Web Development',
    'Data Science',
    'Design',
    'Business',
    'Marketing',
    'Photography',
    'Music',
    'Language'
  ];

  const levels = ['Beginner', 'Intermediate', 'Advanced', 'All Levels'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Course title is required';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.length < 50) {
      newErrors.description = 'Description must be at least 50 characters';
    }
    
    if (!formData.duration.trim()) {
      newErrors.duration = 'Duration is required';
    }
    
    if (!formData.price || formData.price < 0) {
      newErrors.price = 'Valid price is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    
    const newCourse = addCourse({
      ...formData,
      price: parseFloat(formData.price),
      instructor: user?.name || 'Instructor'
    });
    
    setTimeout(() => {
      setLoading(false);
      navigate(`/admin/course/${newCourse.id}`);
    }, 1000);
  };

  return (
    <div className="create-course-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Create New Course</h1>
          <p className="page-subtitle">Fill in the details to create a new course</p>
        </div>
        <div className="page-actions">
          <Button variant="ghost" onClick={() => navigate('/admin/courses')}>
            <FiX /> Cancel
          </Button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="create-course-form">
        <div className="form-grid">
          {/* Main Content */}
          <div className="form-main">
            <Card className="form-section">
              <h3 className="section-title">Basic Information</h3>
              
              <Input
                label="Course Title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g., Complete Web Development Bootcamp"
                error={errors.title}
              />

              <div className="form-group">
                <label className="input-label">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe what students will learn in this course..."
                  className="textarea-field"
                  rows={5}
                />
                {errors.description && (
                  <span className="input-helper error">{errors.description}</span>
                )}
              </div>
            </Card>

            <Card className="form-section">
              <h3 className="section-title">Course Details</h3>
              
              <div className="form-row">
                <div className="form-group">
                  <label className="input-label">Category</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="select-field"
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="input-label">Level</label>
                  <select
                    name="level"
                    value={formData.level}
                    onChange={handleChange}
                    className="select-field"
                  >
                    {levels.map(level => (
                      <option key={level} value={level}>{level}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-row">
                <Input
                  label="Duration"
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  placeholder="e.g., 40 hours"
                  icon={<FiClock />}
                  error={errors.duration}
                />

                <Input
                  label="Price"
                  name="price"
                  type="number"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="99.99"
                  icon={<FiDollarSign />}
                  error={errors.price}
                />
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="form-sidebar">
            <Card className="form-section">
              <h3 className="section-title">Course Image</h3>
              <div className="image-upload">
                <img 
                  src={formData.image} 
                  alt="Course cover" 
                  className="preview-image" 
                />
                <div className="upload-actions">
                  <Button variant="outline" size="small" icon={<FiUpload />}>
                    Upload Image
                  </Button>
                  <p className="upload-hint">Recommended: 1280x720px, JPG or PNG</p>
                </div>
              </div>
              <Input
                name="image"
                value={formData.image}
                onChange={handleChange}
                placeholder="Image URL"
              />
            </Card>

            <Card className="form-section">
              <h3 className="section-title">Instructor</h3>
              <div className="instructor-info">
                <img 
                  src={user?.avatar || 'https://via.placeholder.com/60'} 
                  alt={user?.name} 
                  className="instructor-avatar" 
                />
                <div className="instructor-details">
                  <span className="instructor-name">{user?.name}</span>
                  <span className="instructor-role">Course Creator</span>
                </div>
              </div>
            </Card>

            <Card className="form-section">
              <Button
                type="submit"
                variant="primary"
                size="large"
                fullWidth
                loading={loading}
                icon={<FiSave />}
              >
                Create Course
              </Button>
              <p className="form-hint">
                You can add modules and lessons after creating the course.
              </p>
            </Card>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreateCourse;