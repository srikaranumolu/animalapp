'use client';

import { useState } from 'react';
import Image from 'next/image';
import styles from './Components.module.css';

export default function Settings({ user }) {
  const [activeSection, setActiveSection] = useState('profile');
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [bio, setBio] = useState('Wildlife enthusiast and animal lover. Always looking for new species to discover!');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [quizReminders, setQuizReminders] = useState(true);
  const [friendRequests, setFriendRequests] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [soundEffects, setSoundEffects] = useState(true);
  const [language, setLanguage] = useState('english');

  const handleSaveProfile = (e) => {
    e.preventDefault();
    // In a real app, this would save to an API
    alert('Profile updated successfully!');
  };

  const handlePasswordChange = (e) => {
    e.preventDefault();
    // In a real app, this would trigger a password change flow
    alert('Password change request sent. Check your email to complete the process.');
  };

  const handleDeleteAccount = () => {
    // In a real app, this would show a confirmation modal and handle account deletion
    if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      alert('Account deletion request submitted. You will receive a confirmation email.');
    }
  };

  return (
    <div className={styles.settingsContainer}>
      <header className={styles.settingsHeader}>
        <h1>Settings</h1>
        <p>Manage your account and preferences</p>
      </header>

      <div className={styles.settingsContent}>
        <aside className={styles.settingsSidebar}>
          <button 
            className={`${styles.settingsNavButton} ${activeSection === 'profile' ? styles.active : ''}`}
            onClick={() => setActiveSection('profile')}
          >
            <span className={styles.settingsIcon}>👤</span>
            Profile
          </button>
          <button 
            className={`${styles.settingsNavButton} ${activeSection === 'account' ? styles.active : ''}`}
            onClick={() => setActiveSection('account')}
          >
            <span className={styles.settingsIcon}>🔐</span>
            Account
          </button>
          <button 
            className={`${styles.settingsNavButton} ${activeSection === 'notifications' ? styles.active : ''}`}
            onClick={() => setActiveSection('notifications')}
          >
            <span className={styles.settingsIcon}>🔔</span>
            Notifications
          </button>
          <button 
            className={`${styles.settingsNavButton} ${activeSection === 'appearance' ? styles.active : ''}`}
            onClick={() => setActiveSection('appearance')}
          >
            <span className={styles.settingsIcon}>🎨</span>
            Appearance
          </button>
          <button 
            className={`${styles.settingsNavButton} ${activeSection === 'privacy' ? styles.active : ''}`}
            onClick={() => setActiveSection('privacy')}
          >
            <span className={styles.settingsIcon}>🔒</span>
            Privacy
          </button>
          <button 
            className={`${styles.settingsNavButton} ${activeSection === 'help' ? styles.active : ''}`}
            onClick={() => setActiveSection('help')}
          >
            <span className={styles.settingsIcon}>❓</span>
            Help & Support
          </button>
        </aside>

        <div className={styles.settingsMain}>
          {/* Profile Settings */}
          {activeSection === 'profile' && (
            <div className={styles.settingsSection}>
              <h2>Profile Settings</h2>
              <p className={styles.sectionDescription}>Manage how your profile appears to other animal explorers</p>

              <form onSubmit={handleSaveProfile} className={styles.settingsForm}>
                <div className={styles.profileImageSection}>
                  <div className={styles.currentImage}>
                    <Image 
                      src={user?.avatar || '/animal-avatar.svg'} 
                      alt="Profile" 
                      width={100} 
                      height={100}
                      className={styles.profileImage}
                    />
                  </div>
                  <div className={styles.imageActions}>
                    <button type="button" className={styles.uploadButton}>
                      <span className={styles.actionIcon}>📷</span>
                      Upload Photo
                    </button>
                    <button type="button" className={styles.removeButton}>
                      <span className={styles.actionIcon}>🗑️</span>
                      Remove
                    </button>
                  </div>
                </div>

                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label htmlFor="name">Display Name</label>
                    <input
                      type="text"
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className={styles.settingsInput}
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="email">Email Address</label>
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={styles.settingsInput}
                    />
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="bio">Bio</label>
                  <textarea
                    id="bio"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className={styles.settingsTextarea}
                    rows={4}
                  />
                  <small>Tell other explorers about yourself (max 200 characters)</small>
                </div>

                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label>Favorite Animal</label>
                    <select className={styles.settingsSelect}>
                      <option value="lion">Lion</option>
                      <option value="elephant">Elephant</option>
                      <option value="penguin">Penguin</option>
                      <option value="giraffe">Giraffe</option>
                      <option value="frog">Frog</option>
                    </select>
                  </div>

                  <div className={styles.formGroup}>
                    <label>Preferred Category</label>
                    <select className={styles.settingsSelect}>
                      <option value="mammals">Mammals</option>
                      <option value="birds">Birds</option>
                      <option value="reptiles">Reptiles</option>
                      <option value="amphibians">Amphibians</option>
                      <option value="insects">Insects</option>
                    </select>
                  </div>
                </div>

                <div className={styles.formActions}>
                  <button type="submit" className={styles.saveButton}>
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Account Settings */}
          {activeSection === 'account' && (
            <div className={styles.settingsSection}>
              <h2>Account Settings</h2>
              <p className={styles.sectionDescription}>Manage your account security and preferences</p>

              <div className={styles.accountCard}>
                <h3>Change Password</h3>
                <form onSubmit={handlePasswordChange} className={styles.passwordForm}>
                  <div className={styles.formGroup}>
                    <label htmlFor="currentPassword">Current Password</label>
                    <input
                      type="password"
                      id="currentPassword"
                      className={styles.settingsInput}
                      placeholder="••••••••"
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="newPassword">New Password</label>
                    <input
                      type="password"
                      id="newPassword"
                      className={styles.settingsInput}
                      placeholder="••••••••"
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="confirmPassword">Confirm New Password</label>
                    <input
                      type="password"
                      id="confirmPassword"
                      className={styles.settingsInput}
                      placeholder="••••••••"
                    />
                  </div>

                  <button type="submit" className={styles.passwordButton}>
                    Update Password
                  </button>
                </form>
              </div>

              <div className={styles.accountCard}>
                <h3>Connected Accounts</h3>
                <div className={styles.connectedAccount}>
                  <div className={styles.providerIcon}>
                    <Image 
                      src="/google-icon.svg" 
                      alt="Google" 
                      width={24} 
                      height={24} 
                    />
                  </div>
                  <div className={styles.providerInfo}>
                    <h4>Google</h4>
                    <p>Connected as {email}</p>
                  </div>
                  <button className={styles.disconnectButton}>
                    Disconnect
                  </button>
                </div>

                <button className={styles.addAccountButton}>
                  <span>+</span> Connect Another Account
                </button>
              </div>

              <div className={styles.dangerZone}>
                <h3>Danger Zone</h3>
                <p>Permanently delete your account and all your data</p>
                <button 
                  className={styles.deleteAccountButton}
                  onClick={handleDeleteAccount}
                >
                  Delete Account
                </button>
              </div>
            </div>
          )}

          {/* Notification Settings */}
          {activeSection === 'notifications' && (
            <div className={styles.settingsSection}>
              <h2>Notification Settings</h2>
              <p className={styles.sectionDescription}>Control how and when you receive notifications</p>

              <div className={styles.toggleSetting}>
                <div className={styles.toggleInfo}>
                  <h3>Enable Notifications</h3>
                  <p>Master toggle for all notifications</p>
                </div>
                <label className={styles.toggleSwitch}>
                  <input
                    type="checkbox"
                    checked={notificationsEnabled}
                    onChange={() => setNotificationsEnabled(!notificationsEnabled)}
                  />
                  <span className={styles.toggleSlider}></span>
                </label>
              </div>

              <div className={styles.notificationGroup}>
                <h3>Notification Channels</h3>

                <div className={styles.toggleSetting}>
                  <div className={styles.toggleInfo}>
                    <h4>Email Notifications</h4>
                    <p>Receive notifications via email</p>
                  </div>
                  <label className={styles.toggleSwitch}>
                    <input
                      type="checkbox"
                      checked={emailNotifications}
                      onChange={() => setEmailNotifications(!emailNotifications)}
                      disabled={!notificationsEnabled}
                    />
                    <span className={styles.toggleSlider}></span>
                  </label>
                </div>

                <div className={styles.toggleSetting}>
                  <div className={styles.toggleInfo}>
                    <h4>Push Notifications</h4>
                    <p>Receive notifications on your device</p>
                  </div>
                  <label className={styles.toggleSwitch}>
                    <input
                      type="checkbox"
                      checked={pushNotifications}
                      onChange={() => setPushNotifications(!pushNotifications)}
                      disabled={!notificationsEnabled}
                    />
                    <span className={styles.toggleSlider}></span>
                  </label>
                </div>
              </div>

              <div className={styles.notificationGroup}>
                <h3>Notification Types</h3>

                <div className={styles.toggleSetting}>
                  <div className={styles.toggleInfo}>
                    <h4>Quiz Reminders & Results</h4>
                    <p>Get notified about quizzes and their results</p>
                  </div>
                  <label className={styles.toggleSwitch}>
                    <input
                      type="checkbox"
                      checked={quizReminders}
                      onChange={() => setQuizReminders(!quizReminders)}
                      disabled={!notificationsEnabled}
                    />
                    <span className={styles.toggleSlider}></span>
                  </label>
                </div>

                <div className={styles.toggleSetting}>
                  <div className={styles.toggleInfo}>
                    <h4>Friend Requests & Messages</h4>
                    <p>Get notified about social interactions</p>
                  </div>
                  <label className={styles.toggleSwitch}>
                    <input
                      type="checkbox"
                      checked={friendRequests}
                      onChange={() => setFriendRequests(!friendRequests)}
                      disabled={!notificationsEnabled}
                    />
                    <span className={styles.toggleSlider}></span>
                  </label>
                </div>
              </div>

              <button className={styles.saveButton}>
                Save Notification Preferences
              </button>
            </div>
          )}

          {/* Appearance Settings */}
          {activeSection === 'appearance' && (
            <div className={styles.settingsSection}>
              <h2>Appearance Settings</h2>
              <p className={styles.sectionDescription}>Customize how the application looks and feels</p>

              <div className={styles.themeOptions}>
                <h3>Theme</h3>
                <div className={styles.themeCards}>
                  <div className={`${styles.themeCard} ${!darkMode ? styles.activeTheme : ''}`} onClick={() => setDarkMode(false)}>
                    <div className={styles.themePreview} style={{ backgroundColor: '#fff' }}>
                      <div className={styles.previewHeader} style={{ backgroundColor: '#4caf50' }}></div>
                      <div className={styles.previewContent}>
                        <div className={styles.previewBlock}></div>
                        <div className={styles.previewLine}></div>
                        <div className={styles.previewLine}></div>
                      </div>
                    </div>
                    <div className={styles.themeName}>Light Mode</div>
                  </div>

                  <div className={`${styles.themeCard} ${darkMode ? styles.activeTheme : ''}`} onClick={() => setDarkMode(true)}>
                    <div className={styles.themePreview} style={{ backgroundColor: '#333' }}>
                      <div className={styles.previewHeader} style={{ backgroundColor: '#2e7d32' }}></div>
                      <div className={styles.previewContent}>
                        <div className={styles.previewBlock} style={{ backgroundColor: '#444' }}></div>
                        <div className={styles.previewLine} style={{ backgroundColor: '#555' }}></div>
                        <div className={styles.previewLine} style={{ backgroundColor: '#555' }}></div>
                      </div>
                    </div>
                    <div className={styles.themeName}>Dark Mode</div>
                  </div>
                </div>
              </div>

              <div className={styles.toggleSetting}>
                <div className={styles.toggleInfo}>
                  <h3>Sound Effects</h3>
                  <p>Play sounds for achievements and notifications</p>
                </div>
                <label className={styles.toggleSwitch}>
                  <input
                    type="checkbox"
                    checked={soundEffects}
                    onChange={() => setSoundEffects(!soundEffects)}
                  />
                  <span className={styles.toggleSlider}></span>
                </label>
              </div>

              <div className={styles.appearanceOption}>
                <h3>Language</h3>
                <div className={styles.languageSelect}>
                  <select 
                    value={language} 
                    onChange={(e) => setLanguage(e.target.value)}
                    className={styles.settingsSelect}
                  >
                    <option value="english">English</option>
                    <option value="spanish">Spanish</option>
                    <option value="french">French</option>
                    <option value="german">German</option>
                    <option value="chinese">Chinese</option>
                    <option value="japanese">Japanese</option>
                  </select>
                </div>
              </div>

              <button className={styles.saveButton}>
                Save Appearance Settings
              </button>
            </div>
          )}

          {/* Privacy Settings */}
          {activeSection === 'privacy' && (
            <div className={styles.settingsSection}>
              <h2>Privacy Settings</h2>
              <p className={styles.sectionDescription}>Control your privacy and data settings</p>

              <div className={styles.privacyCard}>
                <h3>Profile Privacy</h3>
                
                <div className={styles.privacyOption}>
                  <label htmlFor="profileVisibility">Who can view your profile</label>
                  <select id="profileVisibility" className={styles.settingsSelect}>
                    <option value="everyone">Everyone</option>
                    <option value="friends">Friends Only</option>
                    <option value="private">Private</option>
                  </select>
                </div>

                <div className={styles.privacyOption}>
                  <label htmlFor="collectionVisibility">Who can view your animal collection</label>
                  <select id="collectionVisibility" className={styles.settingsSelect}>
                    <option value="everyone">Everyone</option>
                    <option value="friends">Friends Only</option>
                    <option value="private">Private</option>
                  </select>
                </div>

                <div className={styles.privacyOption}>
                  <label htmlFor="activityVisibility">Who can see your activities</label>
                  <select id="activityVisibility" className={styles.settingsSelect}>
                    <option value="everyone">Everyone</option>
                    <option value="friends">Friends Only</option>
                    <option value="private">Private</option>
                  </select>
                </div>
              </div>

              <div className={styles.privacyCard}>
                <h3>Data & Personalization</h3>
                
                <div className={styles.toggleSetting}>
                  <div className={styles.toggleInfo}>
                    <h4>Usage Data Collection</h4>
                    <p>Allow collection of usage data to improve your experience</p>
                  </div>
                  <label className={styles.toggleSwitch}>
                    <input type="checkbox" defaultChecked />
                    <span className={styles.toggleSlider}></span>
                  </label>
                </div>

                <div className={styles.toggleSetting}>
                  <div className={styles.toggleInfo}>
                    <h4>Personalized Content</h4>
                    <p>Show personalized content based on your interests</p>
                  </div>
                  <label className={styles.toggleSwitch}>
                    <input type="checkbox" defaultChecked />
                    <span className={styles.toggleSlider}></span>
                  </label>
                </div>
              </div>

              <div className={styles.privacyLinks}>
                <a href="#" className={styles.privacyLink}>Privacy Policy</a>
                <a href="#" className={styles.privacyLink}>Terms of Service</a>
                <a href="#" className={styles.privacyLink}>Download My Data</a>
              </div>
            </div>
          )}

          {/* Help & Support */}
          {activeSection === 'help' && (
            <div className={styles.settingsSection}>
              <h2>Help & Support</h2>
              <p className={styles.sectionDescription}>Get help and learn more about Animal Explorer</p>

              <div className={styles.helpGrid}>
                <div className={styles.helpCard}>
                  <div className={styles.helpIcon}>📚</div>
                  <h3>Guide & Tutorials</h3>
                  <p>Learn how to use all features of Animal Explorer</p>
                  <a href="#" className={styles.helpLink}>View Guides</a>
                </div>

                <div className={styles.helpCard}>
                  <div className={styles.helpIcon}>❓</div>
                  <h3>FAQs</h3>
                  <p>Find answers to common questions</p>
                  <a href="#" className={styles.helpLink}>Browse FAQs</a>
                </div>

                <div className={styles.helpCard}>
                  <div className={styles.helpIcon}>💬</div>
                  <h3>Contact Support</h3>
                  <p>Need help? Contact our support team</p>
                  <a href="#" className={styles.helpLink}>Get Support</a>
                </div>

                <div className={styles.helpCard}>
                  <div className={styles.helpIcon}>🐞</div>
                  <h3>Report a Bug</h3>
                  <p>Found an issue? Let us know!</p>
                  <a href="#" className={styles.helpLink}>Report Bug</a>
                </div>
              </div>

              <div className={styles.aboutSection}>
                <h3>About Animal Explorer</h3>
                <p>
                  Animal Explorer v1.2.0<br />
                  © 2024 Animal Explorer Team<br />
                  Made with 💚 for animal lovers
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 