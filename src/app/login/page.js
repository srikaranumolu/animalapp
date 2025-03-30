'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from '../page.module.css';
import Image from 'next/image';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { login, loginWithGoogle, forgotPassword, user } = useAuth();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      router.push('/dashboard');
    }
  }, [user, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Clear previous messages
    setError('');
    setSuccess('');
    setLoading(true);
    
    try {
      const result = await login(emailOrUsername, password);
      
      if (result.error) {
        setError(result.error);
        setLoading(false);
        return;
      }
      
      // Successfully logged in
      setSuccess('Login successful! Redirecting...');
      setTimeout(() => {
        router.push('/dashboard');
      }, 1500);
    } catch (err) {
      setError('Login failed. Please try again later.');
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
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
      setSuccess('Login successful! Redirecting...');
      setTimeout(() => {
        router.push('/dashboard');
      }, 1500);
    } catch (err) {
      setError('Google sign in failed. Please try again later.');
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    // Clear previous messages
    setError('');
    setSuccess('');
    
    if (!emailOrUsername) {
      setError('Please enter your username or email address to reset password');
      return;
    }
    
    setLoading(true);
    try {
      const result = await forgotPassword(emailOrUsername);
      
      if (result.error) {
        setError(result.error);
      } else {
        setSuccess('Password reset email sent. Please check your inbox.');
      }
    } catch (err) {
      setError('Failed to send reset email. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.authPage}>
      <div className={styles.authCard}>
        <Link href="/">
          <Image
            src="/auth-logo.svg"
            alt="Login"
            width={80}
            height={80}
            className={styles.authLogo}
            priority
          />
        </Link>
        <h1 className={styles.authTitle}>Welcome Back, Explorer!</h1>
        
        {error && <div className={styles.errorMessage}>{error}</div>}
        {success && <div className={styles.successMessage}>{success}</div>}
        
        <form onSubmit={handleSubmit} className={styles.authForm}>
          <div className={styles.formGroup}>
            <label htmlFor="emailOrUsername">Username or Email</label>
            <input
              id="emailOrUsername"
              type="text"
              value={emailOrUsername}
              onChange={(e) => setEmailOrUsername(e.target.value)}
              required
              className={styles.input}
              disabled={loading}
              placeholder="explorer123 or your@email.com"
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
            <button 
              type="button" 
              onClick={handleForgotPassword} 
              className={styles.forgotPassword}
              disabled={loading}
            >
              Forgot Password?
            </button>
          </div>
          
          <button 
            type="submit" 
            className={styles.primary}
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Start Adventure'}
          </button>
          
          <div className={styles.orDivider}>
            <span>OR</span>
          </div>
          
          <button 
            type="button" 
            onClick={handleGoogleSignIn} 
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
            Continue with Google
          </button>
        </form>
        
        <p className={styles.authFooter}>
          New to Animal Explorer?{' '}
          <Link href="/signup" className={styles.link}>
            Join the Safari
          </Link>
        </p>
      </div>
    </div>
  );
}