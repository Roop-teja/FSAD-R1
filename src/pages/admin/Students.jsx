import { useState } from 'react';
import { useData } from '../../context/DataContext';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Table from '../../components/common/Table';
import ProgressBar from '../../components/common/ProgressBar';
import {
  FiSearch,
  FiMail,
  FiMoreVertical,
  FiEye,
  FiUserPlus
} from 'react-icons/fi';
import './Students.css';

const Students = () => {
  const { students, courses, calculateCourseProgress } = useData();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const columns = [
    {
      header: 'Student',
      accessor: 'name',
      render: (student) => (
        <div className="student-cell">
          <img src={student.avatar} alt={student.name} className="student-avatar" />
          <div className="student-info">
            <span className="student-name">{student.name}</span>
            <span className="student-email">{student.email}</span>
          </div>
        </div>
      )
    },
    {
      header: 'Enrolled Courses',
      accessor: 'enrolledCourses',
      render: (student) => (
        <span className="course-count">{student.enrolledCourses.length} courses</span>
      )
    },
    {
      header: 'Progress',
      render: (student) => {
        const avgProgress = student.enrolledCourses.length > 0
          ? Math.round(student.enrolledCourses.reduce((acc, courseId) => {
              return acc + calculateCourseProgress(student.id, courseId);
            }, 0) / student.enrolledCourses.length)
          : 0;
        return (
          <div className="progress-cell">
            <ProgressBar value={avgProgress} size="small" />
            <span className="progress-text">{avgProgress}%</span>
          </div>
        );
      }
    },
    {
      header: 'Join Date',
      accessor: 'joinDate',
      render: (student) => (
        <span className="date">{new Date(student.joinDate).toLocaleDateString()}</span>
      )
    },
    {
      header: 'Actions',
      render: (student) => (
        <div className="action-buttons">
          <Button 
            variant="ghost" 
            size="small" 
            icon={<FiEye />}
            onClick={() => setSelectedStudent(student)}
          >
            View
          </Button>
          <Button variant="ghost" size="small" icon={<FiMail />}>
            Email
          </Button>
        </div>
      )
    }
  ];

  return (
    <div className="students-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Students</h1>
          <p className="page-subtitle">Manage and track student progress</p>
        </div>
        <div className="page-actions">
          <Button variant="primary" icon={<FiUserPlus />}>
            Add Student
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="stats-row">
        <Card className="stat-item">
          <span className="stat-value">{students.length}</span>
          <span className="stat-label">Total Students</span>
        </Card>
        <Card className="stat-item">
          <span className="stat-value">
            {students.filter(s => s.enrolledCourses.length > 0).length}
          </span>
          <span className="stat-label">Active Students</span>
        </Card>
        <Card className="stat-item">
          <span className="stat-value">
            {students.reduce((acc, s) => acc + s.enrolledCourses.length, 0)}
          </span>
          <span className="stat-label">Total Enrollments</span>
        </Card>
      </div>

      {/* Search */}
      <div className="search-section">
        <Input
          placeholder="Search students by name or email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          icon={<FiSearch />}
        />
      </div>

      {/* Students Table */}
      <Card className="table-card">
        <Table
          columns={columns}
          data={filteredStudents}
          emptyMessage="No students found"
        />
      </Card>

      {/* Student Detail Modal */}
      {selectedStudent && (
        <div className="student-modal-overlay" onClick={() => setSelectedStudent(null)}>
          <div className="student-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Student Details</h2>
              <button className="close-btn" onClick={() => setSelectedStudent(null)}>×</button>
            </div>
            <div className="modal-body">
              <div className="student-profile">
                <img src={selectedStudent.avatar} alt={selectedStudent.name} className="profile-avatar" />
                <div className="profile-info">
                  <h3>{selectedStudent.name}</h3>
                  <p>{selectedStudent.email}</p>
                  <span className="join-date">Joined {selectedStudent.joinDate}</span>
                </div>
              </div>

              <div className="enrolled-section">
                <h4>Enrolled Courses ({selectedStudent.enrolledCourses.length})</h4>
                <div className="enrolled-list">
                  {selectedStudent.enrolledCourses.map(courseId => {
                    const course = courses.find(c => c.id === courseId);
                    const progress = calculateCourseProgress(selectedStudent.id, courseId);
                    if (!course) return null;
                    return (
                      <div key={courseId} className="enrolled-item">
                        <img src={course.image} alt={course.title} className="course-thumb" />
                        <div className="course-details">
                          <span className="course-title">{course.title}</span>
                          <div className="course-progress">
                            <ProgressBar value={progress} size="small" />
                            <span>{progress}%</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Students;