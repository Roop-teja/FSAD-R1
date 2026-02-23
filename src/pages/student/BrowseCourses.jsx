import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Modal from '../../components/common/Modal';
import {
  FiSearch,
  FiFilter,
  FiClock,
  FiUsers,
  FiStar,
  FiPlay
} from 'react-icons/fi';
import './BrowseCourses.css';

const BrowseCourses = () => {
  const { user } = useAuth();
  const { courses, enrollStudent } = useData();
  const navigate = useNavigate();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [showEnrollModal, setShowEnrollModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);

  const categories = ['all', ...new Set(courses.map(c => c.category))];
  const levels = ['all', 'Beginner', 'Intermediate', 'Advanced', 'All Levels'];

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || course.category === selectedCategory;
    const matchesLevel = selectedLevel === 'all' || course.level === selectedLevel;
    const notEnrolled = !user?.enrolledCourses?.includes(course.id);
    
    return matchesSearch && matchesCategory && matchesLevel && notEnrolled;
  });

  const handleEnroll = (course) => {
    setSelectedCourse(course);
    setShowEnrollModal(true);
  };

  const confirmEnroll = () => {
    if (selectedCourse && user) {
      enrollStudent(user.id, selectedCourse.id);
      setShowEnrollModal(false);
      setSelectedCourse(null);
      navigate(`/student/course/${selectedCourse.id}`);
    }
  };

  return (
    <div className="browse-courses-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Browse Courses</h1>
          <p className="page-subtitle">Discover new courses and expand your knowledge</p>
        </div>
      </div>

      {/* Filters */}
      <div className="filters-section">
        <div className="search-input">
          <Input
            placeholder="Search courses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            icon={<FiSearch />}
          />
        </div>
        <div className="filter-group">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="filter-select"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>
                {cat === 'all' ? 'All Categories' : cat}
              </option>
            ))}
          </select>
          <select
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value)}
            className="filter-select"
          >
            {levels.map(level => (
              <option key={level} value={level}>
                {level === 'all' ? 'All Levels' : level}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Results Count */}
      <p className="results-count">
        Showing {filteredCourses.length} course{filteredCourses.length !== 1 ? 's' : ''}
      </p>

      {/* Courses Grid */}
      <div className="courses-grid">
        {filteredCourses.map(course => (
          <Card key={course.id} className="course-card" hover>
            <div className="course-image-wrapper">
              <img src={course.image} alt={course.title} className="course-image" />
              <span className="category-badge">{course.category}</span>
              <span className="level-badge">{course.level}</span>
            </div>
            <Card.Body>
              <h3 className="course-title">{course.title}</h3>
              <p className="course-instructor">by {course.instructor}</p>
              <p className="course-description">{course.description}</p>
              
              <div className="course-meta">
                <span className="meta-item">
                  <FiClock /> {course.duration}
                </span>
                <span className="meta-item">
                  <FiUsers /> {course.enrolledStudents.length} students
                </span>
                <span className="meta-item rating">
                  <FiStar /> 4.8
                </span>
              </div>

              <div className="course-footer">
                <span className="course-price">${course.price}</span>
                <Button 
                  variant="primary" 
                  onClick={() => handleEnroll(course)}
                >
                  Enroll Now
                </Button>
              </div>
            </Card.Body>
          </Card>
        ))}
      </div>

      {filteredCourses.length === 0 && (
        <div className="empty-state">
          <FiSearch className="empty-icon" />
          <h3>No courses found</h3>
          <p>Try adjusting your search or filter criteria</p>
        </div>
      )}

      {/* Enroll Modal */}
      <Modal
        isOpen={showEnrollModal}
        onClose={() => setShowEnrollModal(false)}
        title="Enroll in Course"
        size="medium"
        footer={
          <>
            <Button variant="ghost" onClick={() => setShowEnrollModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={confirmEnroll}>
              Confirm Enrollment
            </Button>
          </>
        }
      >
        {selectedCourse && (
          <div className="enroll-preview">
            <img src={selectedCourse.image} alt={selectedCourse.title} className="preview-image" />
            <h3>{selectedCourse.title}</h3>
            <p className="preview-instructor">by {selectedCourse.instructor}</p>
            <div className="preview-details">
              <span><FiClock /> {selectedCourse.duration}</span>
              <span><FiUsers /> {selectedCourse.enrolledStudents.length} students</span>
            </div>
            <p className="preview-description">{selectedCourse.description}</p>
            <div className="preview-price">
              <span className="price-label">Price:</span>
              <span className="price-value">${selectedCourse.price}</span>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default BrowseCourses;