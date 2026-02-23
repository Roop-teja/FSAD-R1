import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import Button from '../../components/common/Button';
import ProgressBar from '../../components/common/ProgressBar';
import {
  FiPlay,
  FiCheckCircle,
  FiClock,
  FiFileText,
  FiChevronDown,
  FiChevronRight,
  FiArrowLeft,
  FiMenu
} from 'react-icons/fi';
import './CourseLearning.css';

const CourseLearning = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, markLessonComplete } = useAuth();
  const { getCourseById, calculateCourseProgress } = useData();
  
  const course = getCourseById(id);
  const [expandedModule, setExpandedModule] = useState(course?.modules[0]?.id || null);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  if (!course) {
    return (
      <div className="course-not-found">
        <h2>Course not found</h2>
        <Button variant="primary" onClick={() => navigate('/student/courses')}>
          Back to Courses
        </Button>
      </div>
    );
  }

  const progress = calculateCourseProgress(user?.id, course.id);
  const totalLessons = course.modules.reduce((acc, m) => acc + m.lessons.length, 0);
  const completedLessons = user?.completedLessons?.length || 0;

  const handleLessonClick = (lesson, moduleId) => {
    setSelectedLesson(lesson);
  };

  const handleCompleteLesson = (lessonId) => {
    if (user && !user.completedLessons?.includes(lessonId)) {
      markLessonComplete(user.id, lessonId);
    }
  };

  const toggleModule = (moduleId) => {
    setExpandedModule(expandedModule === moduleId ? null : moduleId);
  };

  return (
    <div className="course-learning-page">
      {/* Sidebar */}
      <aside className={`course-sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <button className="back-btn" onClick={() => navigate('/student/courses')}>
            <FiArrowLeft />
          </button>
          <h3 className="sidebar-title">{course.title}</h3>
          <button className="toggle-btn" onClick={() => setSidebarOpen(!sidebarOpen)}>
            <FiMenu />
          </button>
        </div>

        <div className="progress-summary">
          <div className="progress-info">
            <span>{progress}% Complete</span>
            <span>{completedLessons}/{totalLessons} lessons</span>
          </div>
          <ProgressBar value={progress} size="small" />
        </div>

        <div className="modules-list">
          {course.modules.map(module => (
            <div key={module.id} className="module-section">
              <button
                className={`module-header ${expandedModule === module.id ? 'expanded' : ''}`}
                onClick={() => toggleModule(module.id)}
              >
                <span className="module-icon">
                  {expandedModule === module.id ? <FiChevronDown /> : <FiChevronRight />}
                </span>
                <span className="module-title">{module.title}</span>
                <span className="module-count">{module.lessons.length}</span>
              </button>

              {expandedModule === module.id && (
                <div className="lessons-list">
                  {module.lessons.map(lesson => {
                    const isCompleted = user?.completedLessons?.includes(lesson.id);
                    const isSelected = selectedLesson?.id === lesson.id;
                    
                    return (
                      <button
                        key={lesson.id}
                        className={`lesson-item ${isCompleted ? 'completed' : ''} ${isSelected ? 'selected' : ''}`}
                        onClick={() => handleLessonClick(lesson, module.id)}
                      >
                        <span className="lesson-status">
                          {isCompleted ? <FiCheckCircle /> : <FiPlay />}
                        </span>
                        <span className="lesson-title">{lesson.title}</span>
                        <span className="lesson-duration">{lesson.duration}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </div>
      </aside>

      {/* Main Content */}
      <main className="course-content">
        {selectedLesson ? (
          <div className="lesson-view">
            <div className="video-player">
              <div className="video-placeholder">
                <FiPlay className="play-icon" />
                <p>Video: {selectedLesson.title}</p>
              </div>
            </div>

            <div className="lesson-header">
              <div>
                <h2>{selectedLesson.title}</h2>
                <p className="lesson-meta">
                  <span><FiClock /> {selectedLesson.duration}</span>
                  <span><FiFileText /> {selectedLesson.type}</span>
                </p>
              </div>
              <Button
                variant={user?.completedLessons?.includes(selectedLesson.id) ? 'success' : 'primary'}
                onClick={() => handleCompleteLesson(selectedLesson.id)}
                icon={<FiCheckCircle />}
              >
                {user?.completedLessons?.includes(selectedLesson.id) ? 'Completed' : 'Mark as Complete'}
              </Button>
            </div>

            <div className="lesson-content">
              <h3>Lesson Description</h3>
              <p>
                In this lesson, you will learn about {selectedLesson.title.toLowerCase()}. 
                This comprehensive video covers all the essential concepts and provides 
                practical examples to help you understand the material thoroughly.
              </p>

              <h3>Resources</h3>
              <div className="resources-list">
                <div className="resource-item">
                  <FiFileText />
                  <span>Lesson Notes.pdf</span>
                </div>
                <div className="resource-item">
                  <FiFileText />
                  <span>Code Examples.zip</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="course-overview">
            <img src={course.image} alt={course.title} className="course-image" />
            <h1>{course.title}</h1>
            <p className="course-instructor">by {course.instructor}</p>
            
            <div className="course-stats">
              <div className="stat">
                <span className="stat-value">{course.modules.length}</span>
                <span className="stat-label">Modules</span>
              </div>
              <div className="stat">
                <span className="stat-value">{totalLessons}</span>
                <span className="stat-label">Lessons</span>
              </div>
              <div className="stat">
                <span className="stat-value">{course.duration}</span>
                <span className="stat-label">Duration</span>
              </div>
            </div>

            <p className="course-description">{course.description}</p>

            <Button
              variant="primary"
              size="large"
              onClick={() => setSelectedLesson(course.modules[0]?.lessons[0])}
              icon={<FiPlay />}
            >
              Start Learning
            </Button>
          </div>
        )}
      </main>
    </div>
  );
};

export default CourseLearning;