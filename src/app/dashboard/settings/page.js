'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import styles from '../components/Components.module.css';
import { useAuth } from '../../context/AuthContext';

export default function Settings() {
  const { user } = useAuth();
  const [username, setUsername] = useState(user?.displayName || '');
  const [email, setEmail] = useState(user?.email || '');
  const [bio, setBio] = useState('Animal lover and explorer!');
  const [avatar, setAvatar] = useState(user?.photoURL || '/user-avatar.svg');
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);
  
  const [notifications, setNotifications] = useState({
    appNotifications: true,
    emailNotifications: true,
    friendRequests: true,
    newContent: false,
    quizReminders: true
  });
  
  const [privacy, setPrivacy] = useState({
    profileVisibility: 'public',
    showCollections: true,
    showQuizHistory: false
  });
  
  const [appearance, setAppearance] = useState({
    theme: 'light',
    language: 'english',
    fontSize: 'medium'
  });
  
  const handleNotificationChange = (setting) => {
    setNotifications({
      ...notifications,
      [setting]: !notifications[setting]
    });
  };
  
  const handlePrivacyChange = (setting, value) => {
    setPrivacy({
      ...privacy,
      [setting]: typeof value === 'boolean' ? value : value
    });
  };
  
  const handleAppearanceChange = (setting, value) => {
    setAppearance({
      ...appearance,
      [setting]: value
    });
  };

  const handleAvatarClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setIsUploading(true);
      // In a real app, you would upload the file to your server or cloud storage here
      // For now, we'll simulate this with a local URL
      const reader = new FileReader();
      reader.onload = (event) => {
        setAvatar(event.target.result);
        setIsUploading(false);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    // Save settings logic would go here
    alert('Settings saved successfully!');
  };
  
  return (
    <div className={styles.settingsContainer}>
      {/* Profile Settings */}
      <section className={styles.settingsSection}>
        <div className={styles.settingsHeader}>
          <div className={styles.settingsIcon}>👤</div>
          <h2>Profile Settings</h2>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className={styles.avatarUpload}>
            <div 
              className={styles.currentAvatar} 
              onClick={handleAvatarClick}
              style={{cursor: 'pointer'}}
            >
              {isUploading ? (
                <div className={styles.uploadingSpinner}>Uploading...</div>
              ) : (
                <Image 
                  src={avatar} 
                  alt="User Avatar" 
                  width={100} 
                  height={100} 
                />
              )}
            </div>
            <div className={styles.uploadControls}>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                style={{ display: 'none' }}
              />
              <button 
                type="button" 
                className={styles.uploadButton}
                onClick={handleAvatarClick}
              >
                Upload New Avatar
              </button>
              <div className={styles.uploadHint}>
                Click on the avatar to upload a new image.<br/>
                Recommended size: 200x200 pixels. Max file size: 2MB.
              </div>
            </div>
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="YourUsername"
            />
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
            />
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="bio">Bio</label>
            <textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell us about yourself..."
            />
          </div>
          
          <div className={styles.formActions}>
            <button type="button" className={styles.cancelButton}>
              Cancel
            </button>
            <button type="submit" className={styles.saveButton}>
              Save Profile
            </button>
          </div>
        </form>
      </section>
      
      {/* Notification Settings */}
      <section className={styles.settingsSection}>
        <div className={styles.settingsHeader}>
          <div className={styles.settingsIcon}>🔔</div>
          <h2>Notification Settings</h2>
        </div>
        
        <div className={styles.settingRow}>
          <div>
            <div className={styles.settingLabel}>App Notifications</div>
            <div className={styles.settingDescription}>
              Receive notifications within the app
            </div>
          </div>
          <label className={styles.toggleSwitch}>
            <input 
              type="checkbox" 
              checked={notifications.appNotifications}
              onChange={() => handleNotificationChange('appNotifications')}
            />
            <span className={styles.toggleSlider}></span>
          </label>
        </div>
        
        <div className={styles.settingRow}>
          <div>
            <div className={styles.settingLabel}>Email Notifications</div>
            <div className={styles.settingDescription}>
              Receive notifications via email
            </div>
          </div>
          <label className={styles.toggleSwitch}>
            <input 
              type="checkbox" 
              checked={notifications.emailNotifications}
              onChange={() => handleNotificationChange('emailNotifications')}
            />
            <span className={styles.toggleSlider}></span>
          </label>
        </div>
        
        <div className={styles.settingRow}>
          <div>
            <div className={styles.settingLabel}>Friend Requests</div>
            <div className={styles.settingDescription}>
              Notify when you receive a friend request
            </div>
          </div>
          <label className={styles.toggleSwitch}>
            <input 
              type="checkbox" 
              checked={notifications.friendRequests}
              onChange={() => handleNotificationChange('friendRequests')}
            />
            <span className={styles.toggleSlider}></span>
          </label>
        </div>
        
        <div className={styles.settingRow}>
          <div>
            <div className={styles.settingLabel}>New Content</div>
            <div className={styles.settingDescription}>
              Notify when new animals or quizzes are added
            </div>
          </div>
          <label className={styles.toggleSwitch}>
            <input 
              type="checkbox" 
              checked={notifications.newContent}
              onChange={() => handleNotificationChange('newContent')}
            />
            <span className={styles.toggleSlider}></span>
          </label>
        </div>
        
        <div className={styles.settingRow}>
          <div>
            <div className={styles.settingLabel}>Quiz Reminders</div>
            <div className={styles.settingDescription}>
              Remind you to complete daily quizzes
            </div>
          </div>
          <label className={styles.toggleSwitch}>
            <input 
              type="checkbox" 
              checked={notifications.quizReminders}
              onChange={() => handleNotificationChange('quizReminders')}
            />
            <span className={styles.toggleSlider}></span>
          </label>
        </div>
        
        <div className={styles.formActions}>
          <button className={styles.saveButton}>
            Save Notification Settings
          </button>
        </div>
      </section>
      
      {/* Privacy Settings */}
      <section className={styles.settingsSection}>
        <div className={styles.settingsHeader}>
          <div className={styles.settingsIcon}>🔒</div>
          <h2>Privacy Settings</h2>
        </div>
        
        <div className={styles.formGroup}>
          <label htmlFor="profileVisibility">Profile Visibility</label>
          <select 
            id="profileVisibility"
            value={privacy.profileVisibility}
            onChange={(e) => handlePrivacyChange('profileVisibility', e.target.value)}
          >
            <option value="public">Public - Anyone can view your profile</option>
            <option value="friends">Friends Only - Only friends can view your profile</option>
            <option value="private">Private - Only you can view your profile</option>
          </select>
        </div>
        
        <div className={styles.settingRow}>
          <div>
            <div className={styles.settingLabel}>Show Collections</div>
            <div className={styles.settingDescription}>
              Allow others to see your animal collections
            </div>
          </div>
          <label className={styles.toggleSwitch}>
            <input 
              type="checkbox" 
              checked={privacy.showCollections}
              onChange={() => handlePrivacyChange('showCollections', !privacy.showCollections)}
            />
            <span className={styles.toggleSlider}></span>
          </label>
        </div>
        
        <div className={styles.settingRow}>
          <div>
            <div className={styles.settingLabel}>Show Quiz History</div>
            <div className={styles.settingDescription}>
              Allow others to see your quiz results
            </div>
          </div>
          <label className={styles.toggleSwitch}>
            <input 
              type="checkbox" 
              checked={privacy.showQuizHistory}
              onChange={() => handlePrivacyChange('showQuizHistory', !privacy.showQuizHistory)}
            />
            <span className={styles.toggleSlider}></span>
          </label>
        </div>
        
        <div className={styles.formActions}>
          <button className={styles.saveButton}>
            Save Privacy Settings
          </button>
        </div>
      </section>
      
      {/* Appearance Settings */}
      <section className={styles.settingsSection}>
        <div className={styles.settingsHeader}>
          <div className={styles.settingsIcon}>🎨</div>
          <h2>Appearance Settings</h2>
        </div>
        
        <div className={styles.formGroup}>
          <label htmlFor="theme">Theme</label>
          <select 
            id="theme"
            value={appearance.theme}
            onChange={(e) => handleAppearanceChange('theme', e.target.value)}
          >
            <option value="light">Light Mode</option>
            <option value="dark">Dark Mode</option>
            <option value="system">Use System Setting</option>
          </select>
        </div>
        
        <div className={styles.formGroup}>
          <label htmlFor="language">Language</label>
          <select 
            id="language"
            value={appearance.language}
            onChange={(e) => handleAppearanceChange('language', e.target.value)}
          >
            <option value="english">English</option>
            <option value="spanish">Spanish</option>
            <option value="french">French</option>
            <option value="german">German</option>
            <option value="japanese">Japanese</option>
          </select>
        </div>
        
        <div className={styles.formGroup}>
          <label htmlFor="fontSize">Font Size</label>
          <select 
            id="fontSize"
            value={appearance.fontSize}
            onChange={(e) => handleAppearanceChange('fontSize', e.target.value)}
          >
            <option value="small">Small</option>
            <option value="medium">Medium</option>
            <option value="large">Large</option>
          </select>
        </div>
        
        <div className={styles.formActions}>
          <button className={styles.saveButton}>
            Save Appearance Settings
          </button>
        </div>
      </section>
      
      {/* Account Actions */}
      <section className={styles.settingsSection}>
        <div className={styles.settingsHeader}>
          <div className={styles.settingsIcon}>🔑</div>
          <h2>Account Actions</h2>
        </div>
        
        <div className={styles.formGroup}>
          <button className={styles.saveButton}>
            Change Password
          </button>
        </div>
        
        <div className={styles.dangerZone}>
          <h3>Danger Zone</h3>
          <p>These actions are irreversible. Please proceed with caution.</p>
          
          <button className={styles.dangerButton}>
            Delete My Account
          </button>
        </div>
      </section>
    </div>
  );
} 