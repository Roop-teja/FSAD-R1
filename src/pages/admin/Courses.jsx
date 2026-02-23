import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Modal from '../../components/common/Modal';
import ProgressBar from '../../components/common/ProgressBar';
import {
  FiPlus,
  FiSearch,
  FiFilter,
  FiMoreVertical,
  FiEdit2,
  FiTrash2,
  FiEye,
  FiUsers,
  FiClock,
  FiBook
} from 'react-icons/fi';
import './Courses.css';

const Courses = () => {
  const { courses, deleteCourse, students } = useData();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState(null);

  const categories = ['all', ...new Set(courses.map(c => c.category))];

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         course.instructor.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === 'all' || course.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const handleDelete = (course) => {
    setCourseToDelete(course);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (courseToDelete) {
      deleteCourse(courseToDelete.id);
      setShowDeleteModal(false);
      setCourseToDelete(null);
    }
  };

  return (
    <div className="courses-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Courses</h1>
          <p className="page-subtitle">Manage your courses and content</p>
        </div>
        <div className="page-actions">
          <Button variant="primary" icon={<FiPlus />} onClick={() => navigate('/admin/create-course')}>
            Create Course
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="filters-bar">
        <div className="search-filter">
          <Input
            type="text"
            placeholder="Search courses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            icon={<FiSearch />}
          />
        </div>
        <div className="category-filter">
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="filter-select"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>
                {cat === 'all' ? 'All Categories' : cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Courses Grid */}
      <div className="courses-grid">
        {filteredCourses.map(course => (
          <Card key={course.id} className="course-card" hover>
            <div className="course-image-wrapper">
              <img src={course.image} alt={course.title} className="course-image" />
              <span className="course-category-badge">{course.category}</span>
              <span className="course-level-badge">{course.level}</span>
            </div>
            <Card.Body>
              <h3 className="course-title">{course.title}</h3>
              <p className="course-instructor">by {course.instructor}</p>
              <p className="course-description">{course.description}</p>
              
              <div className="course-stats">
                <div className="stat">
                  <FiUsers />
                  <span>{course.enrolledStudents.length} Students</span>
                </div>
                <div className="stat">
                  <FiClock />
                  <span>{course.duration}</span>
                </div>
                <div className="stat">
                  <FiBook />
                  <span>{course.modules.length} Modules</span>
                </div>
              </div>

              <div className="course-progress-section">
                <div className="progress-label">
                  <span>Completion Rate</span>
                  <span>75%</span>
                </div>
                <ProgressBar value={75} size="small" />
              </div>

              <div className="course-price">${course.price}</div>
            </Card.Body>
            <Card.Footer>
              <div className="course-actions">
                <Button 
                  variant="ghost" 
                  size="small"
                  onClick={() => navigate(`/admin/course/${course.id}`)}
                  icon={<FiEye />}
                >
                  View
                </Button>
                <Button 
                  variant="ghost" 
                  size="small"
                  onClick={() => navigate(`/admin/edit-course/${course.id}`)}
                  icon={<FiEdit2 />}
                >
                  Edit
                </Button>
                <Button 
                  variant="ghost" 
                  size="small"
                  className="delete-btn"
                  onClick={() => handleDelete(course)}
                  icon={<FiTrash2 />}
                >
                  Delete
                </Button>
              </div>
            </Card.Footer>
          </Card>
        ))}
      </div>

      {filteredCourses.length === 0 && (
        <div className="empty-state">
          <FiBook className="empty-icon" />
          <h3>No courses found</h3>
          <p>Try adjusting your search or filter criteria</p>
        </div>
      )}

      {/* Delete Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Course"
        size="small"
        footer={
          <>
            <Button variant="ghost" onClick={() => setShowDeleteModal(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={confirmDelete}>
              Delete Course
            </Button>
          </>
        }
      >
        <p>Are you sure you want to delete "{courseToDelete?.title}"? This action cannot be undone and will remove all associated content and student progress.</p>
      </Modal>
    </div>
  );
};

export default Courses;