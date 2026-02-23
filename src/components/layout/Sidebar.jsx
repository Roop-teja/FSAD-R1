import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  FiHome,
  FiBook,
  FiFileText,
  FiUsers,
  FiSettings,
  FiChevronLeft,
  FiChevronRight,
  FiPlusCircle,
  FiFolder,
  FiAward,
  FiBarChart2,
  FiLayers
} from 'react-icons/fi';
import './Sidebar.css';

const Sidebar = ({ collapsed, setCollapsed }) => {
  const { user } = useAuth();
  const location = useLocation();
  const isAdmin = user?.role === 'admin';

  const adminMenuItems = [
    { path: '/admin/dashboard', icon: <FiHome />, label: 'Dashboard' },
    { path: '/admin/courses', icon: <FiBook />, label: 'Courses' },
    { path: '/admin/create-course', icon: <FiPlusCircle />, label: 'Create Course' },
    { path: '/admin/content', icon: <FiFolder />, label: 'Content' },
    { path: '/admin/assignments', icon: <FiFileText />, label: 'Assignments' },
    { path: '/admin/students', icon: <FiUsers />, label: 'Students' },
    { path: '/admin/progress', icon: <FiBarChart2 />, label: 'Progress' },
    { path: '/admin/settings', icon: <FiSettings />, label: 'Settings' }
  ];

  const studentMenuItems = [
    { path: '/student/dashboard', icon: <FiHome />, label: 'Dashboard' },
    { path: '/student/courses', icon: <FiBook />, label: 'My Courses' },
    { path: '/student/browse', icon: <FiLayers />, label: 'Browse Courses' },
    { path: '/student/assignments', icon: <FiFileText />, label: 'Assignments' },
    { path: '/student/certificates', icon: <FiAward />, label: 'Certificates' },
    { path: '/student/settings', icon: <FiSettings />, label: 'Settings' }
  ];

  const menuItems = isAdmin ? adminMenuItems : studentMenuItems;

  return (
    <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <div className="logo-icon">
            <FiBook />
          </div>
          {!collapsed && <span className="logo-text">EduConnect</span>}
        </div>
        <button
          className="sidebar-toggle"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? <FiChevronRight /> : <FiChevronLeft />}
        </button>
      </div>

      <nav className="sidebar-nav">
        <ul className="nav-list">
          {menuItems.map((item) => (
            <li key={item.path} className="nav-item">
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `nav-link ${isActive ? 'active' : ''}`
                }
              >
                <span className="nav-icon">{item.icon}</span>
                {!collapsed && <span className="nav-label">{item.label}</span>}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="sidebar-footer">
        <div className="user-info">
          <img
            src={user?.avatar || 'https://via.placeholder.com/40'}
            alt={user?.name}
            className="user-avatar"
          />
          {!collapsed && (
            <div className="user-details">
              <span className="user-name">{user?.name}</span>
              <span className="user-role">{isAdmin ? 'Administrator' : 'Student'}</span>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;