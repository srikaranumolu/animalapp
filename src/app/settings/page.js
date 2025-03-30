'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { updateUserProfile, uploadUserAvatar } from '../firebase/user';
import styles from '../dashboard/components/Components.module.css';

export default function ProfileSettings() {
  const { user } = useAuth();
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [bio, setBio] = useState('Animal lover and explorer!');
  const [avatar, setAvatar] = useState('/user-avatar.svg');
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const fileInputRef = useRef(null);
  
  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    
    // Load user data
    setUsername(user.displayName || '');
    setEmail(user.email || '');
    setAvatar(user.photoURL || '/user-avatar.svg');
  }, [user, router]);
  
  const handleAvatarClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    try {
      setIsUploading(true);
      setMessage({ text: '', type: '' });
      
      // Upload the image and get the URL
      const downloadURL = await uploadUserAvatar(file);
      
      // Update the avatar in the UI
      setAvatar(downloadURL);
      
      // Update the user profile
      await updateUserProfile({ photoURL: downloadURL });
      
      setMessage({ text: 'Profile picture updated successfully!', type: 'success' });
    } catch (error) {
      console.error('Error uploading image:', error);
      setMessage({ text: 'Failed to upload image. Please try again.', type: 'error' });
    } finally {
      setIsUploading(false);
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setIsSaving(true);
      setMessage({ text: '', type: '' });
      
      // Update the user profile
      await updateUserProfile({ 
        displayName: username
      });
      
      setMessage({ text: 'Profile updated successfully!', type: 'success' });
    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage({ text: 'Failed to update profile. Please try again.', type: 'error' });
    } finally {
      setIsSaving(false);
    }
  };
  
  if (!user) {
    return <div>Loading...</div>;
  }
  
  return (
    <div className={styles.settingsContainer}>
      <section className={styles.settingsSection}>
        <div className={styles.settingsHeader}>
          <div className={styles.settingsIcon}>👤</div>
          <h2>Profile Settings</h2>
        </div>
        
        {message.text && (
          <div className={message.type === 'error' ? styles.errorMessage : styles.successMessage}>
            {message.text}
          </div>
        )}
        
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
                disabled={isUploading}
              >
                {isUploading ? 'Uploading...' : 'Upload New Avatar'}
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
              disabled={true}
              placeholder="your@email.com"
            />
            <small>Email cannot be changed</small>
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
            <button 
              type="button" 
              className={styles.cancelButton}
              onClick={() => router.push('/dashboard')}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className={styles.saveButton}
              disabled={isSaving}
            >
              {isSaving ? 'Saving...' : 'Save Profile'}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
} 