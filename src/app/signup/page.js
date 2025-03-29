'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from '../page.module.css';
import { useAuth } from '../context/AuthContext';
import Image from 'next/image';

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { register, loginWithGoogle } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Clear previous messages
    setError('');
    setSuccess('');
    setLoading(true);
    
    // Basic validation
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }
    
    // Password strength validation
    if (password.length < 6) {
      setError('Password should be at least 6 characters long');
      setLoading(false);
      return;
    }
    
    try {
      // Register with email and password
      const result = await register(email, password);
      
      if (result.error) {
        setError(result.error);
        setLoading(false);
        return;
      }
      
      // Successfully registered
      setSuccess('Account created successfully! Redirecting to login...');
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    } catch (err) {
      setError('Signup failed. Please try again later.');
      setLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    // Clear previous messages
    setError('');
    setSuccess('');
    setLoading(true);
    
    try {
      const result = await loginWithGoogle();
      
      // Handle in-progress redirect
      if (result.inProgress) {
        // This is normal for redirect flow, we'll just show a loading message
        setSuccess('Redirecting to Google...');
        return; // The page will redirect
      }
      
      if (result.error) {
        // Special handling for VS Code Live Server issues
        if (result.error.includes('Live Server')) {
          setError(result.error);
          setLoading(false);
          return;
        }
        
        // Check for specific internal error
        if (result.error.includes('internal-error') || result.error.includes('misconfigured')) {
          setError(
            'Google sign-in failed. Please make sure you have set up your Firebase project correctly. ' +
            'Check the README for detailed setup instructions.'
          );
        } else {
          setError(result.error);
        }
        setLoading(false);
        return;
      }
      
      // Successfully signed in with Google
      setSuccess('Account created successfully! Redirecting...');
      setTimeout(() => {
        router.push('/');
      }, 1500);
    } catch (err) {
      setError('Google sign in failed. Please try again later.');
      setLoading(false);
    }
  };

  return (
    <div className={styles.authPage}>
      <div className={styles.authCard}>
        <Image
          src="/auth-logo.svg"
          alt="Sign Up"
          width={80}
          height={80}
          className={styles.authLogo}
          priority
        />
        <h1 className={styles.authTitle}>Create Account</h1>
        
        {error && <div className={styles.errorMessage}>{error}</div>}
        {success && <div className={styles.successMessage}>{success}</div>}
        
        <form onSubmit={handleSubmit} className={styles.authForm}>
          <div className={styles.formGroup}>
            <label htmlFor="name">Full Name</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className={styles.input}
              disabled={loading}
              placeholder="John Doe"
            />
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className={styles.input}
              disabled={loading}
              placeholder="your@email.com"
            />
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className={styles.input}
              disabled={loading}
              placeholder="••••••••"
            />
            <small className={styles.passwordHint}>
              Must be at least 6 characters long
            </small>
          </div>
          
          <div className={styles.formGroup}>
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className={styles.input}
              disabled={loading}
              placeholder="••••••••"
            />
          </div>
          
          <button 
            type="submit" 
            className={styles.primary}
            disabled={loading}
          >
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
          
          <div className={styles.orDivider}>
            <span>OR</span>
          </div>
          
          <button 
            type="button" 
            onClick={handleGoogleSignUp} 
            className={styles.googleBtn}
            disabled={loading}
          >
            <Image 
              src="/google-icon.svg" 
              alt="Google" 
              width={20} 
              height={20}
              style={{ marginRight: '10px' }}
            />
            Sign up with Google
          </button>
        </form>
        
        <p className={styles.authFooter}>
          Already have an account?{" "}
          <Link href="/login" className={styles.link}>
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}