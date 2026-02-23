import { createContext, useContext, useState } from 'react';

// Dummy Data
const initialCourses = [
  {
    id: 1,
    title: 'Complete Web Development Bootcamp',
    description: 'Learn HTML, CSS, JavaScript, React, Node.js and more. Build real-world projects and become a full-stack developer.',
    instructor: 'Dr. Sarah Johnson',
    category: 'Web Development',
    level: 'Beginner',
    duration: '40 hours',
    price: 89.99,
    image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400',
    enrolledStudents: [1, 2, 3, 4, 5],
    modules: [
      {
        id: 1,
        title: 'Introduction to Web Development',
        lessons: [
          { id: 1, title: 'What is Web Development?', duration: '15 min', type: 'video', completed: true },
          { id: 2, title: 'How the Internet Works', duration: '20 min', type: 'video', completed: true },
          { id: 3, title: 'Setting Up Your Development Environment', duration: '25 min', type: 'video', completed: false }
        ]
      },
      {
        id: 2,
        title: 'HTML Fundamentals',
        lessons: [
          { id: 4, title: 'Introduction to HTML', duration: '30 min', type: 'video', completed: false },
          { id: 5, title: 'HTML Elements and Tags', duration: '35 min', type: 'video', completed: false },
          { id: 6, title: 'HTML Forms and Inputs', duration: '40 min', type: 'video', completed: false }
        ]
      },
      {
        id: 3,
        title: 'CSS Styling',
        lessons: [
          { id: 7, title: 'Introduction to CSS', duration: '25 min', type: 'video', completed: false },
          { id: 8, title: 'CSS Selectors and Properties', duration: '30 min', type: 'video', completed: false },
          { id: 9, title: 'Flexbox Layout', duration: '45 min', type: 'video', completed: false }
        ]
      }
    ],
    createdAt: '2024-01-15'
  },
  {
    id: 2,
    title: 'Python for Data Science',
    description: 'Master Python programming and learn data analysis, visualization, and machine learning fundamentals.',
    instructor: 'Prof. Michael Chen',
    category: 'Data Science',
    level: 'Intermediate',
    duration: '35 hours',
    price: 79.99,
    image: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=400',
    enrolledStudents: [1, 2, 3],
    modules: [
      {
        id: 1,
        title: 'Python Basics',
        lessons: [
          { id: 1, title: 'Variables and Data Types', duration: '20 min', type: 'video', completed: true },
          { id: 2, title: 'Control Flow', duration: '25 min', type: 'video', completed: false },
          { id: 3, title: 'Functions and Modules', duration: '30 min', type: 'video', completed: false }
        ]
      },
      {
        id: 2,
        title: 'Data Analysis with Pandas',
        lessons: [
          { id: 4, title: 'Introduction to Pandas', duration: '35 min', type: 'video', completed: false },
          { id: 5, title: 'Data Manipulation', duration: '40 min', type: 'video', completed: false }
        ]
      }
    ],
    createdAt: '2024-02-01'
  },
  {
    id: 3,
    title: 'UI/UX Design Masterclass',
    description: 'Learn user interface and user experience design principles. Create stunning designs with Figma.',
    instructor: 'Emily Rodriguez',
    category: 'Design',
    level: 'All Levels',
    duration: '28 hours',
    price: 69.99,
    image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400',
    enrolledStudents: [1, 4, 5],
    modules: [
      {
        id: 1,
        title: 'Design Fundamentals',
        lessons: [
          { id: 1, title: 'Principles of Design', duration: '25 min', type: 'video', completed: false },
          { id: 2, title: 'Color Theory', duration: '30 min', type: 'video', completed: false },
          { id: 3, title: 'Typography Basics', duration: '20 min', type: 'video', completed: false }
        ]
      }
    ],
    createdAt: '2024-02-10'
  },
  {
    id: 4,
    title: 'React.js Complete Guide',
    description: 'Build modern web applications with React. Learn hooks, context, Redux, and more.',
    instructor: 'Dr. Sarah Johnson',
    category: 'Web Development',
    level: 'Intermediate',
    duration: '32 hours',
    price: 94.99,
    image: 'https://images.unsplash.com/photo-1633356122544-f603b6bf3783?w=400',
    enrolledStudents: [2, 3, 4],
    modules: [
      {
        id: 1,
        title: 'React Basics',
        lessons: [
          { id: 1, title: 'Introduction to React', duration: '20 min', type: 'video', completed: false },
          { id: 2, title: 'JSX and Components', duration: '30 min', type: 'video', completed: false },
          { id: 3, title: 'Props and State', duration: '35 min', type: 'video', completed: false }
        ]
      },
      {
        id: 2,
        title: 'React Hooks',
        lessons: [
          { id: 4, title: 'useState Hook', duration: '25 min', type: 'video', completed: false },
          { id: 5, title: 'useEffect Hook', duration: '30 min', type: 'video', completed: false },
          { id: 6, title: 'Custom Hooks', duration: '40 min', type: 'video', completed: false }
        ]
      }
    ],
    createdAt: '2024-02-15'
  },
  {
    id: 5,
    title: 'Machine Learning A-Z',
    description: 'Comprehensive machine learning course covering supervised, unsupervised learning and deep learning basics.',
    instructor: 'Prof. Michael Chen',
    category: 'Data Science',
    level: 'Advanced',
    duration: '50 hours',
    price: 129.99,
    image: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400',
    enrolledStudents: [1, 5],
    modules: [
      {
        id: 1,
        title: 'Introduction to ML',
        lessons: [
          { id: 1, title: 'What is Machine Learning?', duration: '25 min', type: 'video', completed: false },
          { id: 2, title: 'Types of Machine Learning', duration: '20 min', type: 'video', completed: false }
        ]
      }
    ],
    createdAt: '2024-03-01'
  }
];

const initialStudents = [
  {
    id: 1,
    name: 'Alex Thompson',
    email: 'alex@student.com',
    password: 'student123',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100',
    enrolledCourses: [1, 2, 3, 5],
    completedLessons: [1, 2],
    role: 'student',
    joinDate: '2024-01-20'
  },
  {
    id: 2,
    name: 'Jessica Williams',
    email: 'jessica@student.com',
    password: 'student123',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100',
    enrolledCourses: [1, 2, 4],
    completedLessons: [1],
    role: 'student',
    joinDate: '2024-02-05'
  },
  {
    id: 3,
    name: 'David Brown',
    email: 'david@student.com',
    password: 'student123',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100',
    enrolledCourses: [1, 2, 4],
    completedLessons: [],
    role: 'student',
    joinDate: '2024-02-10'
  },
  {
    id: 4,
    name: 'Emma Davis',
    email: 'emma@student.com',
    password: 'student123',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
    enrolledCourses: [1, 3, 4],
    completedLessons: [1, 2, 3],
    role: 'student',
    joinDate: '2024-02-15'
  },
  {
    id: 5,
    name: 'Ryan Miller',
    email: 'ryan@student.com',
    password: 'student123',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
    enrolledCourses: [1, 3, 5],
    completedLessons: [1],
    role: 'student',
    joinDate: '2024-02-20'
  }
];

const initialAssignments = [
  {
    id: 1,
    courseId: 1,
    title: 'Build a Personal Portfolio Website',
    description: 'Create a responsive portfolio website using HTML and CSS. Include sections for About, Projects, and Contact.',
    dueDate: '2024-03-15',
    maxScore: 100,
    submissions: [
      { id: 1, studentId: 1, submittedAt: '2024-03-10', file: 'portfolio_alex.zip', score: 85, feedback: 'Great work! Clean design and good responsiveness.' },
      { id: 2, studentId: 2, submittedAt: '2024-03-12', file: 'portfolio_jessica.zip', score: 92, feedback: 'Excellent portfolio! Very professional design.' }
    ]
  },
  {
    id: 2,
    courseId: 1,
    title: 'JavaScript DOM Manipulation Project',
    description: 'Build an interactive to-do list application with add, edit, delete, and filter functionality.',
    dueDate: '2024-03-25',
    maxScore: 100,
    submissions: [
      { id: 3, studentId: 1, submittedAt: '2024-03-20', file: 'todo_alex.zip', score: 88, feedback: 'Good implementation. Consider adding local storage.' }
    ]
  },
  {
    id: 3,
    courseId: 2,
    title: 'Data Analysis with Pandas',
    description: 'Analyze the provided dataset and create visualizations using Pandas and Matplotlib.',
    dueDate: '2024-03-20',
    maxScore: 100,
    submissions: []
  },
  {
    id: 4,
    courseId: 3,
    title: 'Design a Mobile App UI',
    description: 'Create a complete UI design for a fitness tracking mobile app using Figma.',
    dueDate: '2024-03-28',
    maxScore: 100,
    submissions: [
      { id: 4, studentId: 4, submittedAt: '2024-03-25', file: 'fitness_app_emma.fig', score: 95, feedback: 'Outstanding design! Great attention to detail.' }
    ]
  },
  {
    id: 5,
    courseId: 4,
    title: 'Build a React Counter App',
    description: 'Create a counter application with increment, decrement, reset, and step functionality using React hooks.',
    dueDate: '2024-04-01',
    maxScore: 100,
    submissions: []
  }
];

const initialAdmin = {
  id: 100,
  name: 'Dr. Sarah Johnson',
  email: 'admin@educonnect.com',
  password: 'admin123',
  avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100',
  role: 'admin',
  department: 'Computer Science',
  bio: 'Experienced educator with 10+ years in web development and software engineering.'
};

const DataContext = createContext();

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

export const DataProvider = ({ children }) => {
  const [courses, setCourses] = useState(initialCourses);
  const [students, setStudents] = useState(initialStudents);
  const [assignments, setAssignments] = useState(initialAssignments);
  const [admin] = useState(initialAdmin);
  const [notifications, setNotifications] = useState([
    { id: 1, message: 'New student registration: Alex Thompson', time: '2 hours ago', read: false },
    { id: 2, message: 'Assignment submitted by Jessica Williams', time: '5 hours ago', read: false },
    { id: 3, message: 'New course review for Web Development', time: '1 day ago', read: true }
  ]);

  // Course Management
  const addCourse = (course) => {
    const newCourse = {
      ...course,
      id: Date.now(),
      enrolledStudents: [],
      modules: [],
      createdAt: new Date().toISOString().split('T')[0]
    };
    setCourses([...courses, newCourse]);
    return newCourse;
  };

  const updateCourse = (id, updatedData) => {
    setCourses(courses.map(course => 
      course.id === id ? { ...course, ...updatedData } : course
    ));
  };

  const deleteCourse = (id) => {
    setCourses(courses.filter(course => course.id !== id));
    setAssignments(assignments.filter(assignment => assignment.courseId !== id));
  };

  const getCourseById = (id) => {
    return courses.find(course => course.id === parseInt(id));
  };

  // Module and Lesson Management
  const addModule = (courseId, module) => {
    const newModule = {
      ...module,
      id: Date.now(),
      lessons: []
    };
    setCourses(courses.map(course => {
      if (course.id === courseId) {
        return { ...course, modules: [...course.modules, newModule] };
      }
      return course;
    }));
    return newModule;
  };

  const addLesson = (courseId, moduleId, lesson) => {
    const newLesson = {
      ...lesson,
      id: Date.now(),
      completed: false
    };
    setCourses(courses.map(course => {
      if (course.id === courseId) {
        return {
          ...course,
          modules: course.modules.map(module => {
            if (module.id === moduleId) {
              return { ...module, lessons: [...module.lessons, newLesson] };
            }
            return module;
          })
        };
      }
      return course;
    }));
    return newLesson;
  };

  // Assignment Management
  const addAssignment = (assignment) => {
    const newAssignment = {
      ...assignment,
      id: Date.now(),
      submissions: []
    };
    setAssignments([...assignments, newAssignment]);
    return newAssignment;
  };

  const updateAssignment = (id, updatedData) => {
    setAssignments(assignments.map(assignment =>
      assignment.id === id ? { ...assignment, ...updatedData } : assignment
    ));
  };

  const deleteAssignment = (id) => {
    setAssignments(assignments.filter(assignment => assignment.id !== id));
  };

  const getAssignmentsByCourse = (courseId) => {
    return assignments.filter(assignment => assignment.courseId === parseInt(courseId));
  };

  const submitAssignment = (assignmentId, submission) => {
    const newSubmission = {
      ...submission,
      id: Date.now(),
      submittedAt: new Date().toISOString().split('T')[0],
      score: null,
      feedback: ''
    };
    setAssignments(assignments.map(assignment => {
      if (assignment.id === assignmentId) {
        return { ...assignment, submissions: [...assignment.submissions, newSubmission] };
      }
      return assignment;
    }));
    return newSubmission;
  };

  const gradeSubmission = (assignmentId, submissionId, score, feedback) => {
    setAssignments(assignments.map(assignment => {
      if (assignment.id === assignmentId) {
        return {
          ...assignment,
          submissions: assignment.submissions.map(sub => {
            if (sub.id === submissionId) {
              return { ...sub, score, feedback };
            }
            return sub;
          })
        };
      }
      return assignment;
    }));
  };

  // Student Management
  const getStudentById = (id) => {
    return students.find(student => student.id === parseInt(id));
  };

  const enrollStudent = (studentId, courseId) => {
    setStudents(students.map(student => {
      if (student.id === studentId && !student.enrolledCourses.includes(courseId)) {
        return { ...student, enrolledCourses: [...student.enrolledCourses, courseId] };
      }
      return student;
    }));
    setCourses(courses.map(course => {
      if (course.id === courseId && !course.enrolledStudents.includes(studentId)) {
        return { ...course, enrolledStudents: [...course.enrolledStudents, studentId] };
      }
      return course;
    }));
  };

  const markLessonComplete = (studentId, lessonId) => {
    setStudents(students.map(student => {
      if (student.id === studentId && !student.completedLessons.includes(lessonId)) {
        return { ...student, completedLessons: [...student.completedLessons, lessonId] };
      }
      return student;
    }));
  };

  // Progress Calculation
  const calculateCourseProgress = (studentId, courseId) => {
    const student = getStudentById(studentId);
    const course = getCourseById(courseId);
    if (!student || !course) return 0;

    const totalLessons = course.modules.reduce((acc, module) => acc + module.lessons.length, 0);
    if (totalLessons === 0) return 0;

    const completedCount = course.modules.reduce((acc, module) => {
      return acc + module.lessons.filter(lesson => student.completedLessons.includes(lesson.id)).length;
    }, 0);

    return Math.round((completedCount / totalLessons) * 100);
  };

  // Notifications
  const markNotificationRead = (id) => {
    setNotifications(notifications.map(notif =>
      notif.id === id ? { ...notif, read: true } : notif
    ));
  };

  const addNotification = (message) => {
    const newNotification = {
      id: Date.now(),
      message,
      time: 'Just now',
      read: false
    };
    setNotifications([newNotification, ...notifications]);
  };

  // Statistics
  const getStats = () => {
    const totalStudents = students.length;
    const totalCourses = courses.length;
    const totalAssignments = assignments.length;
    const totalEnrollments = students.reduce((acc, student) => acc + student.enrolledCourses.length, 0);
    const pendingSubmissions = assignments.reduce((acc, assignment) => {
      const enrolledCount = courses.find(c => c.id === assignment.courseId)?.enrolledStudents.length || 0;
      return acc + (enrolledCount - assignment.submissions.length);
    }, 0);

    return {
      totalStudents,
      totalCourses,
      totalAssignments,
      totalEnrollments,
      pendingSubmissions
    };
  };

  const value = {
    courses,
    students,
    assignments,
    admin,
    notifications,
    addCourse,
    updateCourse,
    deleteCourse,
    getCourseById,
    addModule,
    addLesson,
    addAssignment,
    updateAssignment,
    deleteAssignment,
    getAssignmentsByCourse,
    submitAssignment,
    gradeSubmission,
    getStudentById,
    enrollStudent,
    markLessonComplete,
    calculateCourseProgress,
    markNotificationRead,
    addNotification,
    getStats
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};

export default DataContext;