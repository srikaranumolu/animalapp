// Import the functions you need from the SDKs you need
import { initializeApp, getApps } from "firebase/app";
import { getAuth, GoogleAuthProvider, connectAuthEmulator } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

// Detect if we're running in a development environment via Live Server
const isLiveServer = typeof window !== 'undefined' && 
  (window.location.hostname.includes('127.0.0.1') || 
   window.location.hostname.includes('localhost'));

console.log("Running in Live Server environment:", isLiveServer);

// Your web app's Firebase configuration
// Replace these with your actual Firebase config values
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

// Validate that required config values are present
const missingValues = Object.entries(firebaseConfig)
  .filter(([key, value]) => !value)
  .map(([key]) => key);

if (missingValues.length > 0) {
  console.error(`Firebase config is missing required values: ${missingValues.join(', ')}`);
  console.error("Please check your .env.local file and ensure all Firebase config values are set properly.");
}

// Log configuration for debugging (remove in production)
console.log("Firebase Config:", {
  apiKey: firebaseConfig.apiKey ? "Present" : "Missing",
  authDomain: firebaseConfig.authDomain ? "Present" : "Missing",
  projectId: firebaseConfig.projectId ? "Present" : "Missing",
  storageBucket: firebaseConfig.storageBucket ? "Present" : "Missing",
  messagingSenderId: firebaseConfig.messagingSenderId ? "Present" : "Missing",
  appId: firebaseConfig.appId ? "Present" : "Missing"
});

// Log environment information
if (typeof window !== 'undefined') {
  console.log("Auth environment info:", {
    hostname: window.location.hostname,
    protocol: window.location.protocol,
    port: window.location.port,
    origin: window.location.origin,
    pathname: window.location.pathname
  });
}

// Initialize Firebase
let firebaseApp;

if (!getApps().length) {
  try {
    // Ensure the config is valid before initializing
    if (missingValues.length === 0) {
      firebaseApp = initializeApp(firebaseConfig);
      console.log("Firebase initialized successfully");
    } else {
      console.error("Firebase initialization skipped due to missing config values");
    }
  } catch (error) {
    console.error("Firebase initialization error:", error.message);
  }
}

// Initialize Firebase Authentication
let auth = null;
let googleProvider = null;
let storage = null;
let db = null;

try {
  // Initialize Firebase Authentication
  auth = getAuth(firebaseApp);
  
  // Initialize Firebase Storage
  storage = getStorage(firebaseApp);
  
  // Initialize Firestore
  db = getFirestore(firebaseApp);
  
  // Handle development environment (VS Code Live Server)
  if (isLiveServer && process.env.NODE_ENV === 'development') {
    // If you're using Live Server, consider setting up an emulator
    // Uncomment this if you set up Firebase Auth Emulator
    // connectAuthEmulator(auth, 'http://localhost:9099');
    console.log("Development environment detected. Consider using Firebase Auth Emulator for local testing.");
  }
  
  googleProvider = new GoogleAuthProvider();
  
  // Configure Google provider with additional scopes
  googleProvider.addScope('profile');
  googleProvider.addScope('email');
  
  // Configure Google provider to always show account selection
  googleProvider.setCustomParameters({
    prompt: 'select_account'
  });
  
  // For Live Server, set login_hint to help with auth issues
  if (isLiveServer) {
    googleProvider.setCustomParameters({
      ...googleProvider.customParameters,
      login_hint: 'user@example.com'
    });
  }
  
  console.log("Firebase Auth initialized successfully");
} catch (error) {
  console.error("Firebase Auth initialization failed:", error.message);
}

// Export the initialized services
export { auth, googleProvider, storage, db, isLiveServer };
export default firebaseApp; 