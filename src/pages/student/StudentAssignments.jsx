import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import Input from '../../components/common/Input';
import {
  FiClock,
  FiCheckCircle,
  FiUpload,
  FiFileText,
  FiCalendar,
  FiAward
} from 'react-icons/fi';
import './StudentAssignments.css';

const StudentAssignments = () => {
  const { user } = useAuth();
  const { assignments, courses, submitAssignment } = useData();
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [submissionFile, setSubmissionFile] = useState('');
  const [submissionNote, setSubmissionNote] = useState('');

  // Get assignments for enrolled courses
  const myAssignments = assignments.filter(a => 
    user?.enrolledCourses?.includes(a.courseId)
  );

  // Separate pending and submitted
  const pendingAssignments = myAssignments.filter(a => 
    !a.submissions.some(s => s.studentId === user?.id)
  );

  const submittedAssignments = myAssignments.filter(a => 
    a.submissions.some(s => s.studentId === user?.id)
  );

  const handleSubmit = (assignment) => {
    setSelectedAssignment(assignment);
    setShowSubmitModal(true);
  };

  const confirmSubmit = () => {
    if (selectedAssignment && submissionFile) {
      submitAssignment(selectedAssignment.id, {
        studentId: user.id,
        file: submissionFile
      });
      setShowSubmitModal(false);
      setSelectedAssignment(null);
      setSubmissionFile('');
      setSubmissionNote('');
    }
  };

  const getSubmissionStatus = (assignment) => {
    const submission = assignment.submissions.find(s => s.studentId === user?.id);
    return submission;
  };

  return (
    <div className="student-assignments-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">My Assignments</h1>
          <p className="page-subtitle">View and submit your assignments</p>
        </div>
      </div>

      {/* Stats */}
      <div className="stats-row">
        <Card className="stat-card">
          <div className="stat-icon pending"><FiClock /></div>
          <div className="stat-content">
            <span className="stat-value">{pendingAssignments.length}</span>
            <span className="stat-label">Pending</span>
          </div>
        </Card>
        <Card className="stat-card">
          <div className="stat-icon submitted"><FiCheckCircle /></div>
          <div className="stat-content">
            <span className="stat-value">{submittedAssignments.length}</span>
            <span className="stat-label">Submitted</span>
          </div>
        </Card>
        <Card className="stat-card">
          <div className="stat-icon graded"><FiAward /></div>
          <div className="stat-content">
            <span className="stat-value">
              {submittedAssignments.filter(a => {
                const sub = a.submissions.find(s => s.studentId === user?.id);
                return sub?.score !== null;
              }).length}
            </span>
            <span className="stat-label">Graded</span>
          </div>
        </Card>
      </div>

      {/* Pending Assignments */}
      <div className="section">
        <h2 className="section-title">Pending Assignments</h2>
        {pendingAssignments.length > 0 ? (
          <div className="assignments-grid">
            {pendingAssignments.map(assignment => {
              const course = courses.find(c => c.id === assignment.courseId);
              return (
                <Card key={assignment.id} className="assignment-card">
                  <div className="assignment-header">
                    <span className="course-name">{course?.title}</span>
                    <span className="due-badge">
                      <FiCalendar /> Due: {assignment.dueDate}
                    </span>
                  </div>
                  <h3 className="assignment-title">{assignment.title}</h3>
                  <p className="assignment-description">{assignment.description}</p>
                  <div className="assignment-footer">
                    <span className="max-score">Max Score: {assignment.maxScore}</span>
                    <Button variant="primary" onClick={() => handleSubmit(assignment)}>
                      <FiUpload /> Submit
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        ) : (
          <div className="empty-state">
            <FiCheckCircle className="empty-icon" />
            <h3>All caught up!</h3>
            <p>You have no pending assignments</p>
          </div>
        )}
      </div>

      {/* Submitted Assignments */}
      <div className="section">
        <h2 className="section-title">Submitted Assignments</h2>
        {submittedAssignments.length > 0 ? (
          <div className="submitted-list">
            {submittedAssignments.map(assignment => {
              const course = courses.find(c => c.id === assignment.courseId);
              const submission = getSubmissionStatus(assignment);
              
              return (
                <Card key={assignment.id} className="submitted-card">
                  <div className="submitted-info">
                    <div className="submitted-header">
                      <h4 className="submitted-title">{assignment.title}</h4>
                      <span className="course-badge">{course?.title}</span>
                    </div>
                    <p className="submitted-date">Submitted: {submission?.submittedAt}</p>
                  </div>
                  <div className="submitted-status">
                    {submission?.score !== null ? (
                      <div className="grade-display">
                        <span className="grade">{submission?.score}</span>
                        <span className="grade-max">/ {assignment.maxScore}</span>
                      </div>
                    ) : (
                      <span className="status-badge pending-review">
                        <FiClock /> Pending Review
                      </span>
                    )}
                  </div>
                  {submission?.feedback && (
                    <div className="feedback-section">
                      <h5>Feedback</h5>
                      <p>{submission.feedback}</p>
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        ) : (
          <div className="empty-state-small">
            <FiFileText className="empty-icon-small" />
            <p>No submitted assignments yet</p>
          </div>
        )}
      </div>

      {/* Submit Modal */}
      <Modal
        isOpen={showSubmitModal}
        onClose={() => setShowSubmitModal(false)}
        title="Submit Assignment"
        size="medium"
        footer={
          <>
            <Button variant="ghost" onClick={() => setShowSubmitModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={confirmSubmit} disabled={!submissionFile}>
              Submit Assignment
            </Button>
          </>
        }
      >
        {selectedAssignment && (
          <div className="submit-form">
            <div className="assignment-preview">
              <h4>{selectedAssignment.title}</h4>
              <p>{selectedAssignment.description}</p>
              <p className="due-info"><FiCalendar /> Due: {selectedAssignment.dueDate}</p>
            </div>
            
            <div className="form-group">
              <label className="input-label">File Name</label>
              <Input
                placeholder="e.g., my_assignment.pdf"
                value={submissionFile}
                onChange={(e) => setSubmissionFile(e.target.value)}
              />
            </div>
            
            <div className="upload-area">
              <FiUpload className="upload-icon" />
              <p>Drag and drop your file here or click to browse</p>
              <span className="upload-hint">Supported formats: PDF, DOC, ZIP (Max 10MB)</span>
            </div>
            
            <div className="form-group">
              <label className="input-label">Notes (Optional)</label>
              <textarea
                className="textarea-field"
                placeholder="Add any notes for your instructor..."
                value={submissionNote}
                onChange={(e) => setSubmissionNote(e.target.value)}
                rows={3}
              />
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default StudentAssignments;