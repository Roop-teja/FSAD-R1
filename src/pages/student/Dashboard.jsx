import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import ProgressBar from '../../components/common/ProgressBar';
import {
  FiBook,
  FiClock,
  FiAward,
  FiPlayCircle,
  FiArrowRight,
  FiCheckCircle
} from 'react-icons/fi';
import './StudentDashboard.css';

const StudentDashboard = () => {
  const { user } = useAuth();
  const { courses, assignments, calculateCourseProgress, getAssignmentsByCourse } = useData();
  const navigate = useNavigate();

  // Get enrolled courses
  const enrolledCourses = courses.filter(course => 
    user?.enrolledCourses?.includes(course.id)
  );

  // Get available courses (not enrolled)
  const availableCourses = courses.filter(course => 
    !user?.enrolledCourses?.includes(course.id)
  ).slice(0, 3);

  // Calculate overall progress
  const overallProgress = enrolledCourses.length > 0
    ? Math.round(enrolledCourses.reduce((acc, course) => {
        return acc + calculateCourseProgress(user.id, course.id);
      }, 0) / enrolledCourses.length)
    : 0;

  // Get upcoming assignments
  const upcomingAssignments = assignments.filter(a => 
    user?.enrolledCourses?.includes(a.courseId)
  ).filter(a => {
    const hasSubmitted = a.submissions.some(s => s.studentId === user.id);
    return !hasSubmitted;
  }).slice(0, 3);

  // Stats
  const stats = [
    {
      label: 'Enrolled Courses',
      value: enrolledCourses.length,
      icon: <FiBook />,
      color: 'primary'
    },
    {
      label: 'Completed Lessons',
      value: user?.completedLessons?.length || 0,
      icon: <FiCheckCircle />,
      color: 'success'
    },
    {
      label: 'Pending Assignments',
      value: upcomingAssignments.length,
      icon: <FiClock />,
      color: 'warning'
    },
    {
      label: 'Overall Progress',
      value: `${overallProgress}%`,
      icon: <FiAward />,
      color: 'secondary'
    }
  ];

  return (
    <div className="student-dashboard">
      <div className="page-header">
        <div>
          <h1 className="page-title">Welcome back, {user?.name?.split(' ')[0]}! 👋</h1>
          <p className="page-subtitle">Continue your learning journey</p>
        </div>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        {stats.map((stat, index) => (
          <Card key={index} className="stat-card" hover>
            <div className={`stat-icon ${stat.color}`}>{stat.icon}</div>
            <div className="stat-content">
              <span className="stat-value">{stat.value}</span>
              <span className="stat-label">{stat.label}</span>
            </div>
          </Card>
        ))}
      </div>

      {/* Continue Learning */}
      <div className="content-section">
        <div className="section-header">
          <h2 className="section-title">Continue Learning</h2>
          <Button variant="ghost" size="small" onClick={() => navigate('/student/courses')}>
            View All <FiArrowRight />
          </Button>
        </div>
        
        {enrolledCourses.length > 0 ? (
          <div className="courses-grid">
            {enrolledCourses.slice(0, 3).map(course => {
              const progress = calculateCourseProgress(user.id, course.id);
              const currentModule = course.modules[0];
              
              return (
                <Card key={course.id} className="course-card" hover>
                  <div className="course-image-wrapper">
                    <img src={course.image} alt={course.title} className="course-image" />
                    <div className="play-overlay">
                      <FiPlayCircle />
                    </div>
                  </div>
                  <Card.Body>
                    <span className="course-category">{course.category}</span>
                    <h3 className="course-title">{course.title}</h3>
                    <p className="course-instructor">by {course.instructor}</p>
                    
                    <div className="progress-section">
                      <div className="progress-header">
                        <span>Progress</span>
                        <span>{progress}%</span>
                      </div>
                      <ProgressBar value={progress} size="small" />
                    </div>

                    <Button 
                      variant="primary" 
                      fullWidth 
                      onClick={() => navigate(`/student/course/${course.id}`)}
                    >
                      Continue Learning
                    </Button>
                  </Card.Body>
                </Card>
              );
            })}
          </div>
        ) : (
          <div className="empty-state">
            <FiBook className="empty-icon" />
            <h3>No enrolled courses yet</h3>
            <p>Browse our courses and start learning today!</p>
            <Button variant="primary" onClick={() => navigate('/student/browse')}>
              Browse Courses
            </Button>
          </div>
        )}
      </div>

      {/* Two Column Layout */}
      <div className="two-column-grid">
        {/* Upcoming Assignments */}
        <div className="content-section">
          <div className="section-header">
            <h2 className="section-title">Upcoming Assignments</h2>
            <Button variant="ghost" size="small" onClick={() => navigate('/student/assignments')}>
              View All
            </Button>
          </div>
          
          {upcomingAssignments.length > 0 ? (
            <div className="assignments-list">
              {upcomingAssignments.map(assignment => {
                const course = courses.find(c => c.id === assignment.courseId);
                return (
                  <div key={assignment.id} className="assignment-item">
                    <div className="assignment-icon">
                      <FiClock />
                    </div>
                    <div className="assignment-content">
                      <h4 className="assignment-title">{assignment.title}</h4>
                      <p className="assignment-course">{course?.title}</p>
                    </div>
                    <div className="assignment-meta">
                      <span className="due-date">Due: {assignment.dueDate}</span>
                      <Button 
                        variant="outline" 
                        size="small"
                        onClick={() => navigate(`/student/assignment/${assignment.id}`)}
                      >
                        Submit
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="empty-state-small">
              <FiCheckCircle className="empty-icon-small" />
              <p>All caught up! No pending assignments.</p>
            </div>
          )}
        </div>

        {/* Explore Courses */}
        <div className="content-section">
          <div className="section-header">
            <h2 className="section-title">Explore New Courses</h2>
            <Button variant="ghost" size="small" onClick={() => navigate('/student/browse')}>
              View All
            </Button>
          </div>
          
          <div className="explore-list">
            {availableCourses.map(course => (
              <div key={course.id} className="explore-item">
                <img src={course.image} alt={course.title} className="explore-image" />
                <div className="explore-content">
                  <h4 className="explore-title">{course.title}</h4>
                  <p className="explore-meta">
                    <span>{course.category}</span>
                    <span>•</span>
                    <span>{course.duration}</span>
                  </p>
                </div>
                <Button 
                  variant="outline" 
                  size="small"
                  onClick={() => navigate(`/student/course/${course.id}`)}
                >
                  Enroll
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;