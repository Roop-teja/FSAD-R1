import { useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import Modal from '../../components/common/Modal';
import {
  FiSave,
  FiX,
  FiUpload,
  FiDollarSign,
  FiClock,
  FiUser,
  FiPlus,
  FiTrash2,
  FiEdit2,
  FiChevronDown,
  FiChevronUp,
  FiVideo,
  FiFileText,
  FiLink,
  FiMove,
  FiImage
} from 'react-icons/fi';
import './CreateCourse.css';

const CreateCourse = () => {
  const { addCourse, updateCourse, getCourseById } = useData();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();
  const fileInputRef = useRef(null);
  
  const isEditing = !!id;
  const existingCourse = isEditing ? getCourseById(id) : null;

  const [formData, setFormData] = useState({
    title: existingCourse?.title || '',
    description: existingCourse?.description || '',
    category: existingCourse?.category || 'Web Development',
    level: existingCourse?.level || 'Beginner',
    duration: existingCourse?.duration || '',
    price: existingCourse?.price || '',
    image: existingCourse?.image || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400'
  });

  const [modules, setModules] = useState(existingCourse?.modules || []);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  
  // Module modal state
  const [showModuleModal, setShowModuleModal] = useState(false);
  const [editingModule, setEditingModule] = useState(null);
  const [moduleForm, setModuleForm] = useState({ title: '', description: '' });
  
  // Lesson modal state
  const [showLessonModal, setShowLessonModal] = useState(false);
  const [editingLesson, setEditingLesson] = useState(null);
  const [currentModuleId, setCurrentModuleId] = useState(null);
  const [lessonForm, setLessonForm] = useState({
    title: '',
    type: 'video',
    duration: '',
    content: '',
    description: ''
  });
  
  // Expanded modules state
  const [expandedModules, setExpandedModules] = useState({});

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

  const lessonTypes = [
    { value: 'video', label: 'Video', icon: <FiVideo /> },
    { value: 'article', label: 'Article', icon: <FiFileText /> },
    { value: 'resource', label: 'Resource/Link', icon: <FiLink /> }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Image upload handler
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      alert('Please upload a valid image file (JPG, PNG, GIF, or WebP)');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size should be less than 5MB');
      return;
    }

    setImageUploading(true);

    // Convert to base64 for preview and storage
    const reader = new FileReader();
    reader.onload = (event) => {
      setFormData(prev => ({ ...prev, image: event.target.result }));
      setImageUploading(false);
    };
    reader.onerror = () => {
      alert('Failed to read the image file');
      setImageUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
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

  // Module functions
  const openModuleModal = (module = null) => {
    if (module) {
      setEditingModule(module);
      setModuleForm({ title: module.title, description: module.description || '' });
    } else {
      setEditingModule(null);
      setModuleForm({ title: '', description: '' });
    }
    setShowModuleModal(true);
  };

  const handleModuleSubmit = () => {
    if (!moduleForm.title.trim()) return;

    if (editingModule) {
      setModules(prev => prev.map(m => 
        m.id === editingModule.id 
          ? { ...m, title: moduleForm.title, description: moduleForm.description }
          : m
      ));
    } else {
      const newModule = {
        id: `module-${Date.now()}`,
        title: moduleForm.title,
        description: moduleForm.description,
        lessons: [],
        order: modules.length + 1
      };
      setModules(prev => [...prev, newModule]);
      setExpandedModules(prev => ({ ...prev, [newModule.id]: true }));
    }
    setShowModuleModal(false);
    setModuleForm({ title: '', description: '' });
  };

  const deleteModule = (moduleId) => {
    setModules(prev => prev.filter(m => m.id !== moduleId));
  };

  const toggleModuleExpand = (moduleId) => {
    setExpandedModules(prev => ({ ...prev, [moduleId]: !prev[moduleId] }));
  };

  const moveModule = (index, direction) => {
    const newModules = [...modules];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= newModules.length) return;
    [newModules[index], newModules[newIndex]] = [newModules[newIndex], newModules[index]];
    newModules.forEach((m, i) => m.order = i + 1);
    setModules(newModules);
  };

  // Lesson functions
  const openLessonModal = (moduleId, lesson = null) => {
    setCurrentModuleId(moduleId);
    if (lesson) {
      setEditingLesson(lesson);
      setLessonForm({
        title: lesson.title,
        type: lesson.type || 'video',
        duration: lesson.duration || '',
        content: lesson.content || '',
        description: lesson.description || ''
      });
    } else {
      setEditingLesson(null);
      setLessonForm({
        title: '',
        type: 'video',
        duration: '',
        content: '',
        description: ''
      });
    }
    setShowLessonModal(true);
  };

  const handleLessonSubmit = () => {
    if (!lessonForm.title.trim()) return;

    const newLesson = {
      id: editingLesson?.id || `lesson-${Date.now()}`,
      title: lessonForm.title,
      type: lessonForm.type,
      duration: lessonForm.duration,
      content: lessonForm.content,
      description: lessonForm.description,
      completed: editingLesson?.completed || false
    };

    setModules(prev => prev.map(m => {
      if (m.id === currentModuleId) {
        const lessons = editingLesson
          ? m.lessons.map(l => l.id === editingLesson.id ? newLesson : l)
          : [...m.lessons, newLesson];
        return { ...m, lessons };
      }
      return m;
    }));

    setShowLessonModal(false);
    setLessonForm({ title: '', type: 'video', duration: '', content: '', description: '' });
  };

  const deleteLesson = (moduleId, lessonId) => {
    setModules(prev => prev.map(m => {
      if (m.id === moduleId) {
        return { ...m, lessons: m.lessons.filter(l => l.id !== lessonId) };
      }
      return m;
    }));
  };

  const moveLesson = (moduleId, index, direction) => {
    setModules(prev => prev.map(m => {
      if (m.id === moduleId) {
        const newLessons = [...m.lessons];
        const newIndex = direction === 'up' ? index - 1 : index + 1;
        if (newIndex < 0 || newIndex >= newLessons.length) return m;
        [newLessons[index], newLessons[newIndex]] = [newLessons[newIndex], newLessons[index]];
        return { ...m, lessons: newLessons };
      }
      return m;
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    
    const courseData = {
      ...formData,
      price: parseFloat(formData.price),
      instructor: user?.name || 'Instructor',
      modules: modules
    };

    if (isEditing) {
      updateCourse(id, courseData);
      setTimeout(() => {
        setLoading(false);
        navigate(`/admin/courses`);
      }, 1000);
    } else {
      const newCourse = addCourse(courseData);
      setTimeout(() => {
        setLoading(false);
        navigate(`/admin/courses`);
      }, 1000);
    }
  };

  const getTotalLessons = () => {
    return modules.reduce((total, m) => total + m.lessons.length, 0);
  };

  const getTotalDuration = () => {
    let totalMinutes = 0;
    modules.forEach(m => {
      m.lessons.forEach(l => {
        if (l.duration) {
          const mins = parseInt(l.duration) || 0;
          totalMinutes += mins;
        }
      });
    });
    const hours = Math.floor(totalMinutes / 60);
    const mins = totalMinutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  return (
    <div className="create-course-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">{isEditing ? 'Edit Course' : 'Create New Course'}</h1>
          <p className="page-subtitle">{isEditing ? 'Update course details and content' : 'Fill in the details to create a new course'}</p>
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

            {/* Modules Section */}
            <Card className="form-section modules-section">
              <div className="section-header">
                <h3 className="section-title">Course Content</h3>
                <Button
                  type="button"
                  variant="outline"
                  size="small"
                  icon={<FiPlus />}
                  onClick={() => openModuleModal()}
                >
                  Add Module
                </Button>
              </div>

              {modules.length === 0 ? (
                <div className="empty-modules">
                  <div className="empty-icon">📚</div>
                  <h4>No modules yet</h4>
                  <p>Add modules to structure your course content</p>
                  <Button
                    type="button"
                    variant="primary"
                    icon={<FiPlus />}
                    onClick={() => openModuleModal()}
                  >
                    Add Your First Module
                  </Button>
                </div>
              ) : (
                <div className="modules-list">
                  {/* Stats */}
                  <div className="modules-stats">
                    <span><strong>{modules.length}</strong> Modules</span>
                    <span><strong>{getTotalLessons()}</strong> Lessons</span>
                    <span><strong>{getTotalDuration()}</strong> Total Duration</span>
                  </div>

                  {modules.map((module, moduleIndex) => (
                    <div key={module.id} className="module-item">
                      <div className="module-header">
                        <div className="module-info">
                          <button
                            type="button"
                            className="expand-btn"
                            onClick={() => toggleModuleExpand(module.id)}
                          >
                            {expandedModules[module.id] ? <FiChevronUp /> : <FiChevronDown />}
                          </button>
                          <span className="module-number">Module {module.order}</span>
                          <h4 className="module-title">{module.title}</h4>
                          <span className="lesson-count">{module.lessons.length} lessons</span>
                        </div>
                        <div className="module-actions">
                          <button
                            type="button"
                            className="action-btn move-btn"
                            onClick={() => moveModule(moduleIndex, 'up')}
                            disabled={moduleIndex === 0}
                            title="Move up"
                          >
                            <FiMove />
                          </button>
                          <button
                            type="button"
                            className="action-btn move-btn"
                            onClick={() => moveModule(moduleIndex, 'down')}
                            disabled={moduleIndex === modules.length - 1}
                            title="Move down"
                          >
                            <FiMove style={{ transform: 'rotate(180deg)' }} />
                          </button>
                          <button
                            type="button"
                            className="action-btn edit-btn"
                            onClick={() => openModuleModal(module)}
                            title="Edit module"
                          >
                            <FiEdit2 />
                          </button>
                          <button
                            type="button"
                            className="action-btn delete-btn"
                            onClick={() => deleteModule(module.id)}
                            title="Delete module"
                          >
                            <FiTrash2 />
                          </button>
                        </div>
                      </div>

                      {expandedModules[module.id] && (
                        <div className="module-content">
                          {module.description && (
                            <p className="module-description">{module.description}</p>
                          )}
                          
                          <div className="lessons-list">
                            {module.lessons.map((lesson, lessonIndex) => (
                              <div key={lesson.id} className="lesson-item">
                                <div className="lesson-info">
                                  <span className="lesson-type-icon">
                                    {lesson.type === 'video' && <FiVideo />}
                                    {lesson.type === 'article' && <FiFileText />}
                                    {lesson.type === 'resource' && <FiLink />}
                                  </span>
                                  <span className="lesson-title">{lesson.title}</span>
                                  {lesson.duration && (
                                    <span className="lesson-duration">{lesson.duration} min</span>
                                  )}
                                </div>
                                <div className="lesson-actions">
                                  <button
                                    type="button"
                                    className="action-btn move-btn"
                                    onClick={() => moveLesson(module.id, lessonIndex, 'up')}
                                    disabled={lessonIndex === 0}
                                    title="Move up"
                                  >
                                    <FiMove />
                                  </button>
                                  <button
                                    type="button"
                                    className="action-btn move-btn"
                                    onClick={() => moveLesson(module.id, lessonIndex, 'down')}
                                    disabled={lessonIndex === module.lessons.length - 1}
                                    title="Move down"
                                  >
                                    <FiMove style={{ transform: 'rotate(180deg)' }} />
                                  </button>
                                  <button
                                    type="button"
                                    className="action-btn edit-btn"
                                    onClick={() => openLessonModal(module.id, lesson)}
                                    title="Edit lesson"
                                  >
                                    <FiEdit2 />
                                  </button>
                                  <button
                                    type="button"
                                    className="action-btn delete-btn"
                                    onClick={() => deleteLesson(module.id, lesson.id)}
                                    title="Delete lesson"
                                  >
                                    <FiTrash2 />
                                  </button>
                                </div>
                              </div>
                            ))}
                            <Button
                              type="button"
                              variant="ghost"
                              size="small"
                              className="add-lesson-btn"
                              icon={<FiPlus />}
                              onClick={() => openLessonModal(module.id)}
                            >
                              Add Lesson
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>

          {/* Sidebar */}
          <div className="form-sidebar">
            <Card className="form-section">
              <h3 className="section-title">Course Image</h3>
              <div className="image-upload">
                <div className="image-preview-container">
                  <img 
                    src={formData.image} 
                    alt="Course cover" 
                    className="preview-image" 
                  />
                  {imageUploading && (
                    <div className="image-uploading-overlay">
                      <div className="upload-spinner"></div>
                      <span>Uploading...</span>
                    </div>
                  )}
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  accept="image/jpeg,image/png,image/gif,image/webp"
                  style={{ display: 'none' }}
                />
                <div className="upload-actions">
                  <Button 
                    type="button"
                    variant="outline" 
                    size="small" 
                    icon={<FiUpload />}
                    onClick={triggerFileInput}
                    disabled={imageUploading}
                  >
                    {imageUploading ? 'Uploading...' : 'Upload Image'}
                  </Button>
                  <p className="upload-hint">Recommended: 1280x720px, JPG or PNG (max 5MB)</p>
                </div>
              </div>
              <div className="form-group">
                <label className="input-label">Or enter image URL</label>
                <Input
                  name="image"
                  value={formData.image.startsWith('data:') ? '' : formData.image}
                  onChange={handleChange}
                  placeholder="https://example.com/image.jpg"
                  icon={<FiImage />}
                />
              </div>
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
                {isEditing ? 'Update Course' : 'Create Course'}
              </Button>
              <p className="form-hint">
                {modules.length === 0 
                  ? 'Add modules to structure your course content.'
                  : `${modules.length} modules with ${getTotalLessons()} lessons ready.`
                }
              </p>
            </Card>
          </div>
        </div>
      </form>

      {/* Module Modal */}
      <Modal
        isOpen={showModuleModal}
        onClose={() => setShowModuleModal(false)}
        title={editingModule ? 'Edit Module' : 'Add New Module'}
      >
        <div className="modal-form">
          <Input
            label="Module Title"
            name="title"
            value={moduleForm.title}
            onChange={(e) => setModuleForm(prev => ({ ...prev, title: e.target.value }))}
            placeholder="e.g., Introduction to Web Development"
          />
          <div className="form-group">
            <label className="input-label">Description (Optional)</label>
            <textarea
              value={moduleForm.description}
              onChange={(e) => setModuleForm(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Brief description of what this module covers..."
              className="textarea-field"
              rows={3}
            />
          </div>
          <div className="modal-actions">
            <Button variant="ghost" onClick={() => setShowModuleModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleModuleSubmit}>
              {editingModule ? 'Update Module' : 'Add Module'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Lesson Modal */}
      <Modal
        isOpen={showLessonModal}
        onClose={() => setShowLessonModal(false)}
        title={editingLesson ? 'Edit Lesson' : 'Add New Lesson'}
      >
        <div className="modal-form">
          <Input
            label="Lesson Title"
            name="title"
            value={lessonForm.title}
            onChange={(e) => setLessonForm(prev => ({ ...prev, title: e.target.value }))}
            placeholder="e.g., Getting Started with HTML"
          />
          
          <div className="form-group">
            <label className="input-label">Lesson Type</label>
            <div className="lesson-type-selector">
              {lessonTypes.map(type => (
                <button
                  key={type.value}
                  type="button"
                  className={`type-btn ${lessonForm.type === type.value ? 'active' : ''}`}
                  onClick={() => setLessonForm(prev => ({ ...prev, type: type.value }))}
                >
                  {type.icon}
                  <span>{type.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="form-row">
            <Input
              label="Duration (minutes)"
              name="duration"
              type="number"
              value={lessonForm.duration}
              onChange={(e) => setLessonForm(prev => ({ ...prev, duration: e.target.value }))}
              placeholder="15"
            />
          </div>

          {lessonForm.type === 'video' && (
            <Input
              label="Video URL"
              name="content"
              value={lessonForm.content}
              onChange={(e) => setLessonForm(prev => ({ ...prev, content: e.target.value }))}
              placeholder="https://youtube.com/..."
            />
          )}

          {lessonForm.type === 'article' && (
            <div className="form-group">
              <label className="input-label">Article Content</label>
              <textarea
                value={lessonForm.content}
                onChange={(e) => setLessonForm(prev => ({ ...prev, content: e.target.value }))}
                placeholder="Write your article content here..."
                className="textarea-field"
                rows={5}
              />
            </div>
          )}

          {lessonForm.type === 'resource' && (
            <Input
              label="Resource URL"
              name="content"
              value={lessonForm.content}
              onChange={(e) => setLessonForm(prev => ({ ...prev, content: e.target.value }))}
              placeholder="https://example.com/resource"
            />
          )}

          <div className="form-group">
            <label className="input-label">Description (Optional)</label>
            <textarea
              value={lessonForm.description}
              onChange={(e) => setLessonForm(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Brief description of this lesson..."
              className="textarea-field"
              rows={2}
            />
          </div>

          <div className="modal-actions">
            <Button variant="ghost" onClick={() => setShowLessonModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleLessonSubmit}>
              {editingLesson ? 'Update Lesson' : 'Add Lesson'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default CreateCourse;
