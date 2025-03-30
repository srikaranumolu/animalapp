import { auth, storage } from './config';
import { updateProfile } from 'firebase/auth';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

// Update user profile information
export const updateUserProfile = async (profileData) => {
  try {
    const user = auth.currentUser;
    if (!user) {
      throw new Error('No user is signed in');
    }
    
    await updateProfile(user, profileData);
    return { success: true, error: null };
  } catch (error) {
    console.error('Error updating profile:', error);
    return { success: false, error: error.message };
  }
};

// Upload user avatar to storage and return the download URL
export const uploadUserAvatar = async (file) => {
  try {
    const user = auth.currentUser;
    if (!user) {
      throw new Error('No user is signed in');
    }
    
    // Create a storage reference with a timestamp to prevent caching issues
    const timestamp = new Date().getTime();
    const storageRef = ref(storage, `user-avatars/${user.uid}_${timestamp}`);
    
    // Set proper metadata
    const metadata = {
      contentType: file.type,
      cacheControl: 'no-cache'
    };
    
    // Upload the file with metadata
    const snapshot = await uploadBytes(storageRef, file, metadata);
    
    // Get the download URL
    const downloadURL = await getDownloadURL(snapshot.ref);
    
    // Update the user profile with the new photoURL
    await updateProfile(user, { photoURL: downloadURL });
    
    // Force refresh the token to ensure profile changes propagate immediately
    await user.reload();
    
    return downloadURL;
  } catch (error) {
    console.error('Error uploading avatar:', error);
    throw error;
  }
}; 