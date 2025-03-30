import { auth, googleProvider, isLiveServer } from './config';
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  onAuthStateChanged,
  sendPasswordResetEmail,
  updateProfile
} from 'firebase/auth';

// Format error messages to be more user-friendly
const formatErrorMessage = (errorCode) => {
  const errorMessages = {
    'auth/email-already-in-use': 'This email is already registered. Try logging in instead.',
    'auth/invalid-email': 'Please enter a valid email address.',
    'auth/weak-password': 'Password should be at least 6 characters long.',
    'auth/user-not-found': 'No account found with this email. Please check or sign up.',
    'auth/wrong-password': 'Incorrect password. Please try again or reset your password.',
    'auth/too-many-requests': 'Too many failed attempts. Please try again later.',
    'auth/popup-closed-by-user': 'Sign in was cancelled. Please try again.',
    'auth/cancelled-popup-request': 'The authentication process was cancelled.',
    'auth/popup-blocked': 'The sign in popup was blocked by your browser. Please allow popups for this site.',
    'auth/operation-not-allowed': 'This sign in method is not enabled. Please contact support.',
    'auth/account-exists-with-different-credential': 'An account already exists with the same email but different sign-in credentials.',
    'auth/network-request-failed': 'A network error occurred. Please check your connection and try again.',
    'auth/internal-error': 'Authentication service encountered an error. Please try again later.',
    'auth/invalid-credential': 'The authentication credential is invalid. Please try again.',
    'auth/unauthorized-domain': 'This domain is not authorized for OAuth operations. Check Firebase Console.',
    'auth/redirect-cancelled-by-user': 'The redirect operation was cancelled by the user.',
    'auth/redirect-operation-pending': 'A redirect sign-in operation is already pending.'
  };
  
  // Extract the error code from the full error message if needed
  const code = errorCode.includes('/') ? errorCode.split('/')[1] : errorCode;
  const fullCode = errorCode.startsWith('auth/') ? errorCode : `auth/${code}`;
  
  return errorMessages[fullCode] || 'An error occurred during authentication. Please try again.';
};

// Email/Password Authentication
export const registerWithEmailAndPassword = async (email, password, username) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    
    // Update the user profile with the username as displayName
    if (username) {
      await updateProfile(userCredential.user, {
        displayName: username
      });
    }
    
    return { user: userCredential.user, error: null };
  } catch (error) {
    console.error("Registration error:", error.code, error.message);
    return { user: null, error: formatErrorMessage(error.code) };
  }
};

export const loginWithEmailAndPassword = async (emailOrUsername, password) => {
  try {
    // Check if input is an email or username
    const isEmail = emailOrUsername.includes('@');
    
    if (isEmail) {
      // If it's an email, proceed with normal login
      const userCredential = await signInWithEmailAndPassword(auth, emailOrUsername, password);
      return { user: userCredential.user, error: null };
    } else {
      // It's a username, need to find the user in Firebase
      // Since Firebase doesn't support username login directly, we'll use a workaround
      // In a real app, you would query a database to find the email associated with the username
      // For this demo, we'll just use the username + "@animalexplorer.com" as email
      // This is a simplified demo approach - in a real app you'd need a proper database query
      const email = `${emailOrUsername}@animalexplorer.com`;
      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        return { user: userCredential.user, error: null };
      } catch (usernameLoginError) {
        console.error("Username login error:", usernameLoginError.code);
        return { user: null, error: "Invalid username or password. Please try again." };
      }
    }
  } catch (error) {
    console.error("Login error:", error.code, error.message);
    return { user: null, error: formatErrorMessage(error.code) };
  }
};

// Google Authentication - Specialized for Live Server environments
export const signInWithGoogle = async () => {
  try {
    console.log("Starting Google sign-in...");
    
    // Clear any previous sessions which might be causing the internal error
    await firebaseSignOut(auth).catch(e => console.log("No active session to clear"));
    
    // Add additional debugging for the provider
    console.log("Google provider configured:", 
      googleProvider ? "Yes" : "No", 
      "Custom parameters:", 
      googleProvider?.customParameters ? "Set" : "Not set"
    );
    
    // Use different sign-in methods based on environment
    let userCredential;
    
    // VS Code Live Server often has issues with popups
    if (isLiveServer) {
      console.log("Using redirect method for Live Server environment");
      try {
        // First check if we're returning from a redirect
        userCredential = await getRedirectResult(auth);
        
        if (!userCredential) {
          // If no result, initiate the redirect
          console.log("No redirect result found, initiating redirect...");
          await signInWithRedirect(auth, googleProvider);
          // This will redirect the page, so the function won't continue
          return { user: null, inProgress: true, error: null };
        } else {
          console.log("Redirect successful, user signed in");
        }
      } catch (redirectError) {
        console.error("Redirect sign-in error:", redirectError);
        // If redirect fails, try popup as fallback
        console.log("Falling back to popup method...");
        userCredential = await signInWithPopup(auth, googleProvider);
      }
    } else {
      // For standard environments, use popup
      userCredential = await signInWithPopup(auth, googleProvider);
    }
    
    console.log("Google sign-in successful:", userCredential?.user?.displayName || "Unknown user");
    return { user: userCredential.user, error: null };
  } catch (error) {
    console.error("Google sign-in error details:", {
      code: error.code,
      message: error.message,
      email: error.email,
      credential: error.credential ? "Present" : "Missing",
      customData: error.customData ? JSON.stringify(error.customData) : "None"
    });
    
    // Live Server specific error handling
    if (isLiveServer && (error.code === 'auth/internal-error' || error.code === 'auth/unauthorized-domain')) {
      return { 
        user: null, 
        error: "Google sign-in failed in Live Server environment. This is a common issue with VS Code Live Server. " +
              "Try accessing the app directly through Firebase Hosting or use email/password sign-in for development."
      };
    }
    
    // Special case for the internal error
    if (error.code === 'auth/internal-error') {
      console.log("Detected auth/internal-error - this could be related to misconfigured Firebase settings");
      
      // Check if Firebase is properly initialized
      if (!auth) {
        return { user: null, error: "Firebase authentication not initialized properly. Please refresh and try again." };
      }
      
      return { 
        user: null, 
        error: "Google sign-in failed. This could be due to a misconfigured Firebase project or network issues. Please check your Firebase settings and ensure you're using an authorized domain." 
      };
    }
    
    return { user: null, error: formatErrorMessage(error.code) };
  }
};

// Sign out
export const signOut = async () => {
  try {
    await firebaseSignOut(auth);
    return { success: true, error: null };
  } catch (error) {
    console.error("Logout error:", error.code, error.message);
    return { success: false, error: formatErrorMessage(error.code) };
  }
};

// Password reset
export const resetPassword = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    return { success: true, error: null };
  } catch (error) {
    console.error("Password reset error:", error.code, error.message);
    return { success: false, error: formatErrorMessage(error.code) };
  }
};

// Listen for auth state changes
export const subscribeToAuthChanges = (callback) => {
  return onAuthStateChanged(auth, callback);
}; 