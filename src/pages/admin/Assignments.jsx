import { useState } from 'react';
import { useData } from '../../context/DataContext';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Modal from '../../components/common/Modal';
import Table from '../../components/common/Table';
import ProgressBar from '../../components/common/ProgressBar';
import {
  FiPlus,
  FiSearch,
  FiCalendar,
  FiUsers,
  FiCheckCircle,
  FiClock,
  FiEdit2,
  FiTrash2,
  FiEye
} from 'react-icons/fi';
import './Assignments.css';

const Assignments = () => {
  const { assignments, courses, students, addAssignment, deleteAssignment, gradeSubmission } = useData();
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showGradeModal, setShowGradeModal] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [newAssignment, setNewAssignment] = useState({
    courseId: '',
    title: '',
    description: '',
    dueDate: '',
    maxScore: 100
  });

  const filteredAssignments = assignments.filter(assignment => {
    const course = courses.find(c => c.id === assignment.courseId);
    return assignment.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
           course?.title.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const handleCreateAssignment = () => {
    if (newAssignment.courseId && newAssignment.title && newAssignment.dueDate) {
      addAssignment({
        ...newAssignment,
        courseId: parseInt(newAssignment.courseId)
      });
      setShowCreateModal(false);
      setNewAssignment({
        courseId: '',
        title: '',
        description: '',
        dueDate: '',
        maxScore: 100
      });
    }
  };

  const handleGrade = (submission, assignment) => {
    setSelectedSubmission({ ...submission, assignment });
    setShowGradeModal(true);
  };

  const submitGrade = (score, feedback) => {
    if (selectedSubmission) {
      gradeSubmission(selectedSubmission.assignment.id, selectedSubmission.id, score, feedback);
      setShowGradeModal(false);
      setSelectedSubmission(null);
    }
  };

  const getSubmissionRate = (assignment) => {
    const course = courses.find(c => c.id === assignment.courseId);
    if (!course) return 0;
    return Math.round((assignment.submissions.length / course.enrolledStudents.length) * 100);
  };

  return (
    <div className="assignments-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Assignments</h1>
          <p className="page-subtitle">Manage assignments and grade submissions</p>
        </div>
        <div className="page-actions">
          <Button variant="primary" icon={<FiPlus />} onClick={() => setShowCreateModal(true)}>
            Create Assignment
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        <Card className="stat-card">
          <div className="stat-icon primary"><FiCalendar /></div>
          <div className="stat-content">
            <span className="stat-value">{assignments.length}</span>
            <span className="stat-label">Total Assignments</span>
          </div>
        </Card>
        <Card className="stat-card">
          <div className="stat-icon success"><FiCheckCircle /></div>
          <div className="stat-content">
            <span className="stat-value">
              {assignments.reduce((acc, a) => acc + a.submissions.filter(s => s.score !== null).length, 0)}
            </span>
            <span className="stat-label">Graded</span>
          </div>
        </Card>
        <Card className="stat-card">
          <div className="stat-icon warning"><FiClock /></div>
          <div className="stat-content">
            <span className="stat-value">
              {assignments.reduce((acc, a) => acc + a.submissions.filter(s => s.score === null).length, 0)}
            </span>
            <span className="stat-label">Pending Review</span>
          </div>
        </Card>
        <Card className="stat-card">
          <div className="stat-icon secondary"><FiUsers /></div>
          <div className="stat-content">
            <span className="stat-value">
              {assignments.reduce((acc, a) => acc + a.submissions.length, 0)}
            </span>
            <span className="stat-label">Total Submissions</span>
          </div>
        </Card>
      </div>

      {/* Search */}
      <div className="search-bar">
        <Input
          placeholder="Search assignments..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          icon={<FiSearch />}
        />
      </div>

      {/* Assignments List */}
      <div className="assignments-list">
        {filteredAssignments.map(assignment => {
          const course = courses.find(c => c.id === assignment.courseId);
          const submissionRate = getSubmissionRate(assignment);
          
          return (
            <Card key={assignment.id} className="assignment-card">
              <div className="assignment-header">
                <div className="assignment-info">
                  <h3 className="assignment-title">{assignment.title}</h3>
                  <p className="assignment-course">{course?.title}</p>
                </div>
                <div className="assignment-meta">
                  <span className="due-date">
                    <FiCalendar /> Due: {assignment.dueDate}
                  </span>
                  <span className="max-score">Max Score: {assignment.maxScore}</span>
                </div>
              </div>
              
              <p className="assignment-description">{assignment.description}</p>
              
              <div className="assignment-progress">
                <div className="progress-header">
                  <span>Submission Rate</span>
                  <span>{submissionRate}%</span>
                </div>
                <ProgressBar value={submissionRate} size="small" />
              </div>
              
              <div className="submissions-preview">
                <h4>Recent Submissions ({assignment.submissions.length})</h4>
                {assignment.submissions.length > 0 ? (
                  <div className="submissions-table">
                    {assignment.submissions.slice(0, 3).map(submission => {
                      const student = students.find(s => s.id === submission.studentId);
                      return (
                        <div key={submission.id} className="submission-row">
                          <div className="student-info">
                            <img src={student?.avatar} alt={student?.name} className="student-avatar" />
                            <span className="student-name">{student?.name}</span>
                          </div>
                          <span className="submission-date">{submission.submittedAt}</span>
                          {submission.score !== null ? (
                            <span className="score graded">{submission.score}/{assignment.maxScore}</span>
                          ) : (
                            <Button 
                              variant="outline" 
                              size="small"
                              onClick={() => handleGrade(submission, assignment)}
                            >
                              Grade
                            </Button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="no-submissions">No submissions yet</p>
                )}
              </div>
              
              <div className="assignment-actions">
                <Button variant="ghost" size="small" icon={<FiEye />}>View All</Button>
                <Button variant="ghost" size="small" icon={<FiEdit2 />}>Edit</Button>
                <Button variant="ghost" size="small" icon={<FiTrash2 />} className="delete-btn">Delete</Button>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Create Assignment Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create New Assignment"
        size="medium"
        footer={
          <>
            <Button variant="ghost" onClick={() => setShowCreateModal(false)}>Cancel</Button>
            <Button variant="primary" onClick={handleCreateAssignment}>Create Assignment</Button>
          </>
        }
      >
        <div className="modal-form">
          <div className="form-group">
            <label className="input-label">Select Course</label>
            <select
              className="select-field"
              value={newAssignment.courseId}
              onChange={(e) => setNewAssignment({ ...newAssignment, courseId: e.target.value })}
            >
              <option value="">Choose a course...</option>
              {courses.map(course => (
                <option key={course.id} value={course.id}>{course.title}</option>
              ))}
            </select>
          </div>
          <Input
            label="Assignment Title"
            value={newAssignment.title}
            onChange={(e) => setNewAssignment({ ...newAssignment, title: e.target.value })}
            placeholder="e.g., Final Project"
          />
          <div className="form-group">
            <label className="input-label">Description</label>
            <textarea
              className="textarea-field"
              value={newAssignment.description}
              onChange={(e) => setNewAssignment({ ...newAssignment, description: e.target.value })}
              placeholder="Describe the assignment..."
              rows={4}
            />
          </div>
          <div className="form-row">
            <Input
              label="Due Date"
              type="date"
              value={newAssignment.dueDate}
              onChange={(e) => setNewAssignment({ ...newAssignment, dueDate: e.target.value })}
            />
            <Input
              label="Max Score"
              type="number"
              value={newAssignment.maxScore}
              onChange={(e) => setNewAssignment({ ...newAssignment, maxScore: parseInt(e.target.value) })}
            />
          </div>
        </div>
      </Modal>

      {/* Grade Modal */}
      <Modal
        isOpen={showGradeModal}
        onClose={() => setShowGradeModal(false)}
        title="Grade Submission"
        size="small"
      >
        {selectedSubmission && (
          <div className="grade-form">
            <div className="submission-details">
              <p><strong>Student:</strong> {students.find(s => s.id === selectedSubmission.studentId)?.name}</p>
              <p><strong>File:</strong> {selectedSubmission.file}</p>
              <p><strong>Submitted:</strong> {selectedSubmission.submittedAt}</p>
            </div>
            <GradeForm 
              maxScore={selectedSubmission.assignment.maxScore}
              onSubmit={submitGrade}
              onCancel={() => setShowGradeModal(false)}
            />
          </div>
        )}
      </Modal>
    </div>
  );
};

const GradeForm = ({ maxScore, onSubmit, onCancel }) => {
  const [score, setScore] = useState('');
  const [feedback, setFeedback] = useState('');

  return (
    <>
      <Input
        label={`Score (out of ${maxScore})`}
        type="number"
        value={score}
        onChange={(e) => setScore(e.target.value)}
        max={maxScore}
      />
      <div className="form-group">
        <label className="input-label">Feedback</label>
        <textarea
          className="textarea-field"
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          placeholder="Provide feedback for the student..."
          rows={3}
        />
      </div>
      <div className="modal-footer">
        <Button variant="ghost" onClick={onCancel}>Cancel</Button>
        <Button variant="primary" onClick={() => onSubmit(parseInt(score), feedback)}>
          Submit Grade
        </Button>
      </div>
    </>
  );
};

export default Assignments;