import { useData } from '../../context/DataContext';
import Card from '../../components/common/Card';
import ProgressBar from '../../components/common/ProgressBar';
import Button from '../../components/common/Button';
import {
  FiUsers,
  FiBook,
  FiFileText,
  FiTrendingUp,
  FiMoreVertical,
  FiArrowRight,
  FiClock,
  FiCheckCircle,
  FiAlertCircle
} from 'react-icons/fi';
import './Dashboard.css';

const AdminDashboard = () => {
  const { courses, students, assignments, getStats, notifications } = useData();
  const stats = getStats();

  const statsCards = [
    {
      title: 'Total Courses',
      value: stats.totalCourses,
      icon: <FiBook />,
      color: 'primary',
      change: '+2 this month',
      positive: true
    },
    {
      title: 'Total Students',
      value: stats.totalStudents,
      icon: <FiUsers />,
      color: 'secondary',
      change: '+5 this week',
      positive: true
    },
    {
      title: 'Assignments',
      value: stats.totalAssignments,
      icon: <FiFileText />,
      color: 'success',
      change: '3 pending review',
      positive: false
    },
    {
      title: 'Pending Submissions',
      value: stats.pendingSubmissions,
      icon: <FiTrendingUp />,
      color: 'warning',
      change: 'Needs attention',
      positive: false
    }
  ];

  const recentActivity = [
    { id: 1, type: 'enrollment', message: 'Alex Thompson enrolled in Web Development', time: '2 hours ago' },
    { id: 2, type: 'submission', message: 'Jessica Williams submitted Portfolio Assignment', time: '5 hours ago' },
    { id: 3, type: 'completion', message: 'Emma Davis completed HTML Fundamentals', time: '1 day ago' },
    { id: 4, type: 'registration', message: 'New student Ryan Miller registered', time: '2 days ago' },
    { id: 5, type: 'grade', message: 'Assignment graded for David Brown', time: '3 days ago' }
  ];

  const topCourses = courses.slice(0, 4).map(course => ({
    ...course,
    enrollmentCount: course.enrolledStudents.length
  }));

  const recentSubmissions = assignments
    .flatMap(a => a.submissions.map(s => ({ ...s, assignment: a })))
    .sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt))
    .slice(0, 5);

  return (
    <div className="dashboard-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">Welcome back! Here's what's happening with your courses.</p>
        </div>
        <div className="page-actions">
          <Button variant="outline" icon={<FiClock />}>
            This Week
          </Button>
          <Button variant="primary" icon={<FiFileText />}>
            Create Assignment
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        {statsCards.map((stat, index) => (
          <Card key={index} className="stats-card" hover>
            <div className={`stats-icon ${stat.color}`}>
              {stat.icon}
            </div>
            <div className="stats-content">
              <span className="stats-value">{stat.value}</span>
              <span className="stats-label">{stat.title}</span>
              <span className={`stats-change ${stat.positive ? 'positive' : 'negative'}`}>
                {stat.change}
              </span>
            </div>
          </Card>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="dashboard-grid">
        {/* Top Courses */}
        <div className="content-section">
          <div className="section-header">
            <h2 className="section-title">Top Courses</h2>
            <Button variant="ghost" size="small" icon={<FiArrowRight />} iconPosition="right">
              View All
            </Button>
          </div>
          <div className="courses-list">
            {topCourses.map(course => (
              <div key={course.id} className="course-item">
                <img src={course.image} alt={course.title} className="course-image" />
                <div className="course-info">
                  <h4 className="course-name">{course.title}</h4>
                  <p className="course-category">{course.category}</p>
                  <div className="course-stats">
                    <span className="stat">
                      <FiUsers /> {course.enrollmentCount} students
                    </span>
                    <span className="stat">
                      <FiClock /> {course.duration}
                    </span>
                  </div>
                </div>
                <div className="course-progress">
                  <ProgressBar 
                    value={course.enrollmentCount * 20} 
                    max={100} 
                    size="small"
                    showLabel
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="content-section">
          <div className="section-header">
            <h2 className="section-title">Recent Activity</h2>
            <Button variant="ghost" size="small" icon={<FiArrowRight />} iconPosition="right">
              View All
            </Button>
          </div>
          <div className="activity-list">
            {recentActivity.map(activity => (
              <div key={activity.id} className="activity-item">
                <div className={`activity-icon ${activity.type}`}>
                  {activity.type === 'enrollment' && <FiUsers />}
                  {activity.type === 'submission' && <FiFileText />}
                  {activity.type === 'completion' && <FiCheckCircle />}
                  {activity.type === 'registration' && <FiUsers />}
                  {activity.type === 'grade' && <FiCheckCircle />}
                </div>
                <div className="activity-content">
                  <p className="activity-message">{activity.message}</p>
                  <span className="activity-time">{activity.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Second Row */}
      <div className="dashboard-grid">
        {/* Recent Submissions */}
        <div className="content-section">
          <div className="section-header">
            <h2 className="section-title">Recent Submissions</h2>
            <Button variant="ghost" size="small" icon={<FiArrowRight />} iconPosition="right">
              View All
            </Button>
          </div>
          {recentSubmissions.length > 0 ? (
            <div className="submissions-list">
              {recentSubmissions.map(submission => {
                const student = students.find(s => s.id === submission.studentId);
                return (
                  <div key={submission.id} className="submission-item">
                    <img 
                      src={student?.avatar || 'https://via.placeholder.com/40'} 
                      alt={student?.name} 
                      className="submission-avatar" 
                    />
                    <div className="submission-info">
                      <h4 className="submission-student">{student?.name}</h4>
                      <p className="submission-assignment">{submission.assignment.title}</p>
                    </div>
                    <div className="submission-meta">
                      <span className="submission-date">{submission.submittedAt}</span>
                      {submission.score ? (
                        <span className="submission-score">{submission.score}/100</span>
                      ) : (
                        <span className="submission-pending">Pending Review</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="empty-state">
              <FiAlertCircle className="empty-icon" />
              <p>No recent submissions</p>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="content-section">
          <div className="section-header">
            <h2 className="section-title">Quick Actions</h2>
          </div>
          <div className="quick-actions">
            <Button variant="outline" fullWidth icon={<FiBook />}>
              Create New Course
            </Button>
            <Button variant="outline" fullWidth icon={<FiFileText />}>
              Add Assignment
            </Button>
            <Button variant="outline" fullWidth icon={<FiUsers />}>
              Manage Students
            </Button>
            <Button variant="outline" fullWidth icon={<FiTrendingUp />}>
              View Reports
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;