import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import Card from '../../components/common/Card';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import {
  FiUser,
  FiMail,
  FiLock,
  FiBell,
  FiGlobe,
  FiSave
} from 'react-icons/fi';
import './Settings.css';

const Settings = () => {
  const { user, updateProfile } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    bio: user?.bio || '',
    department: user?.department || ''
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    pushNotifications: true,
    weeklyReport: true,
    newEnrollment: true,
    assignmentSubmission: true
  });

  const handleProfileUpdate = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      updateProfile(profileData);
      setLoading(false);
    }, 1000);
  };

  const handlePasswordChange = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    }, 1000);
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: <FiUser /> },
    { id: 'security', label: 'Security', icon: <FiLock /> },
    { id: 'notifications', label: 'Notifications', icon: <FiBell /> },
    { id: 'preferences', label: 'Preferences', icon: <FiGlobe /> }
  ];

  return (
    <div className="settings-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Settings</h1>
          <p className="page-subtitle">Manage your account settings and preferences</p>
        </div>
      </div>

      <div className="settings-container">
        {/* Tabs */}
        <div className="settings-tabs">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="settings-content">
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <Card className="settings-card">
              <h3 className="card-title">Profile Information</h3>
              <form onSubmit={handleProfileUpdate}>
                <div className="profile-avatar-section">
                  <img 
                    src={user?.avatar || 'https://via.placeholder.com/100'} 
                    alt={user?.name} 
                    className="avatar-preview" 
                  />
                  <div className="avatar-actions">
                    <Button variant="outline" size="small">Change Avatar</Button>
                    <p className="avatar-hint">JPG, PNG or GIF. Max 2MB</p>
                  </div>
                </div>

                <div className="form-grid">
                  <Input
                    label="Full Name"
                    value={profileData.name}
                    onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                    icon={<FiUser />}
                  />
                  <Input
                    label="Email Address"
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                    icon={<FiMail />}
                  />
                </div>

                <div className="form-group">
                  <label className="input-label">Bio</label>
                  <textarea
                    className="textarea-field"
                    value={profileData.bio}
                    onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                    placeholder="Tell us about yourself..."
                    rows={4}
                  />
                </div>

                <Input
                  label="Department"
                  value={profileData.department}
                  onChange={(e) => setProfileData({ ...profileData, department: e.target.value })}
                />

                <div className="form-actions">
                  <Button type="submit" variant="primary" loading={loading} icon={<FiSave />}>
                    Save Changes
                  </Button>
                </div>
              </form>
            </Card>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <Card className="settings-card">
              <h3 className="card-title">Change Password</h3>
              <form onSubmit={handlePasswordChange}>
                <Input
                  label="Current Password"
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                  icon={<FiLock />}
                />
                <Input
                  label="New Password"
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  icon={<FiLock />}
                />
                <Input
                  label="Confirm New Password"
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                  icon={<FiLock />}
                />
                <div className="form-actions">
                  <Button type="submit" variant="primary" loading={loading}>
                    Update Password
                  </Button>
                </div>
              </form>
            </Card>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <Card className="settings-card">
              <h3 className="card-title">Notification Preferences</h3>
              <div className="notification-options">
                <div className="notification-item">
                  <div className="notification-info">
                    <h4>Email Notifications</h4>
                    <p>Receive email notifications for important updates</p>
                  </div>
                  <label className="toggle">
                    <input
                      type="checkbox"
                      checked={notifications.emailNotifications}
                      onChange={(e) => setNotifications({ ...notifications, emailNotifications: e.target.checked })}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                <div className="notification-item">
                  <div className="notification-info">
                    <h4>Push Notifications</h4>
                    <p>Receive push notifications in your browser</p>
                  </div>
                  <label className="toggle">
                    <input
                      type="checkbox"
                      checked={notifications.pushNotifications}
                      onChange={(e) => setNotifications({ ...notifications, pushNotifications: e.target.checked })}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                <div className="notification-item">
                  <div className="notification-info">
                    <h4>Weekly Report</h4>
                    <p>Receive weekly summary of course activities</p>
                  </div>
                  <label className="toggle">
                    <input
                      type="checkbox"
                      checked={notifications.weeklyReport}
                      onChange={(e) => setNotifications({ ...notifications, weeklyReport: e.target.checked })}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                <div className="notification-item">
                  <div className="notification-info">
                    <h4>New Enrollment Alerts</h4>
                    <p>Get notified when students enroll in your courses</p>
                  </div>
                  <label className="toggle">
                    <input
                      type="checkbox"
                      checked={notifications.newEnrollment}
                      onChange={(e) => setNotifications({ ...notifications, newEnrollment: e.target.checked })}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                <div className="notification-item">
                  <div className="notification-info">
                    <h4>Assignment Submissions</h4>
                    <p>Get notified when students submit assignments</p>
                  </div>
                  <label className="toggle">
                    <input
                      type="checkbox"
                      checked={notifications.assignmentSubmission}
                      onChange={(e) => setNotifications({ ...notifications, assignmentSubmission: e.target.checked })}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
              </div>
            </Card>
          )}

          {/* Preferences Tab */}
          {activeTab === 'preferences' && (
            <Card className="settings-card">
              <h3 className="card-title">Application Preferences</h3>
              <div className="preference-options">
                <div className="preference-item">
                  <label className="input-label">Language</label>
                  <select className="select-field">
                    <option value="en">English</option>
                    <option value="es">Spanish</option>
                    <option value="fr">French</option>
                    <option value="de">German</option>
                  </select>
                </div>

                <div className="preference-item">
                  <label className="input-label">Timezone</label>
                  <select className="select-field">
                    <option value="utc">UTC</option>
                    <option value="est">Eastern Time</option>
                    <option value="pst">Pacific Time</option>
                    <option value="ist">Indian Standard Time</option>
                  </select>
                </div>

                <div className="preference-item">
                  <label className="input-label">Date Format</label>
                  <select className="select-field">
                    <option value="mm/dd/yyyy">MM/DD/YYYY</option>
                    <option value="dd/mm/yyyy">DD/MM/YYYY</option>
                    <option value="yyyy-mm-dd">YYYY-MM-DD</option>
                  </select>
                </div>
              </div>
              <div className="form-actions">
                <Button variant="primary" icon={<FiSave />}>Save Preferences</Button>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;