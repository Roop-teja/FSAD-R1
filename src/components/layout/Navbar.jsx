import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';
import {
  FiMenu,
  FiBell,
  FiSearch,
  FiUser,
  FiSettings,
  FiLogOut,
  FiChevronDown
} from 'react-icons/fi';
import './Navbar.css';

const Navbar = ({ onMenuClick, sidebarCollapsed }) => {
  const { user, logout } = useAuth();
  const { notifications, markNotificationRead } = useData();
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    // Handle search functionality
    console.log('Searching for:', searchQuery);
  };

  return (
    <header className={`navbar ${sidebarCollapsed ? 'expanded' : ''}`}>
      <div className="navbar-left">
        <button className="menu-toggle" onClick={onMenuClick}>
          <FiMenu />
        </button>
        <form className="search-form" onSubmit={handleSearch}>
          <FiSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search courses, assignments..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </form>
      </div>

      <div className="navbar-right">
        {/* Notifications */}
        <div className="navbar-item">
          <button
            className="icon-btn"
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowProfile(false);
            }}
          >
            <FiBell />
            {unreadCount > 0 && (
              <span className="notification-badge">{unreadCount}</span>
            )}
          </button>

          {showNotifications && (
            <div className="dropdown notifications-dropdown">
              <div className="dropdown-header">
                <h4>Notifications</h4>
                <span className="notification-count">{unreadCount} new</span>
              </div>
              <div className="dropdown-body">
                {notifications.length === 0 ? (
                  <p className="empty-message">No notifications</p>
                ) : (
                  notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`notification-item ${!notification.read ? 'unread' : ''}`}
                      onClick={() => markNotificationRead(notification.id)}
                    >
                      <p className="notification-message">{notification.message}</p>
                      <span className="notification-time">{notification.time}</span>
                    </div>
                  ))
                )}
              </div>
              <div className="dropdown-footer">
                <button className="view-all-btn">View All Notifications</button>
              </div>
            </div>
          )}
        </div>

        {/* Profile */}
        <div className="navbar-item">
          <button
            className="profile-btn"
            onClick={() => {
              setShowProfile(!showProfile);
              setShowNotifications(false);
            }}
          >
            <img
              src={user?.avatar || 'https://via.placeholder.com/40'}
              alt={user?.name}
              className="profile-avatar"
            />
            <span className="profile-name">{user?.name?.split(' ')[0]}</span>
            <FiChevronDown className="profile-chevron" />
          </button>

          {showProfile && (
            <div className="dropdown profile-dropdown">
              <div className="dropdown-header profile-header">
                <img
                  src={user?.avatar || 'https://via.placeholder.com/40'}
                  alt={user?.name}
                  className="profile-header-avatar"
                />
                <div className="profile-header-info">
                  <h4>{user?.name}</h4>
                  <span>{user?.email}</span>
                </div>
              </div>
              <div className="dropdown-body">
                <button
                  className="dropdown-item"
                  onClick={() => {
                    const settingsPath = user?.role === 'admin' ? '/admin/settings' : '/student/settings';
                    navigate(settingsPath);
                    setShowProfile(false);
                  }}
                >
                  <FiUser />
                  <span>My Profile</span>
                </button>
                <button
                  className="dropdown-item"
                  onClick={() => {
                    const settingsPath = user?.role === 'admin' ? '/admin/settings' : '/student/settings';
                    navigate(settingsPath);
                    setShowProfile(false);
                  }}
                >
                  <FiSettings />
                  <span>Settings</span>
                </button>
                <hr className="dropdown-divider" />
                <button className="dropdown-item logout" onClick={handleLogout}>
                  <FiLogOut />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;