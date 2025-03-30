'use client';

import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import styles from './dashboard.module.css';

export default function DashboardNavigation() {
  const router = useRouter();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  
  const isActive = (path) => {
    return pathname === path ? styles.activeNavLink : '';
  };
  
  const toggleMobileMenu = () => {
    setMenuOpen(!menuOpen);
  };
  
  return (
    <>
      <button 
        className={styles.mobileMenuButton} 
        onClick={toggleMobileMenu}
        aria-label="Toggle navigation menu"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>
      
      <nav className={`${styles.dashboardNav} ${menuOpen ? styles.mobileMenuOpen : ''}`}>
        <div className={styles.navSection}>
          <h3 className={styles.navSectionTitle}>Explore</h3>
          <Link 
            href="/dashboard" 
            className={`${styles.navLink} ${isActive('/dashboard')}`}
          >
            <span className={styles.navIcon}>🏠</span>
            Overview
          </Link>
          <Link 
            href="/dashboard/collection" 
            className={`${styles.navLink} ${isActive('/dashboard/collection')}`}
          >
            <span className={styles.navIcon}>🐾</span>
            My Collection
          </Link>
          <Link 
            href="/dashboard/quiz-history" 
            className={`${styles.navLink} ${isActive('/dashboard/quiz-history')}`}
          >
            <span className={styles.navIcon}>📝</span>
            Quiz History
          </Link>
          <Link 
            href="/random-facts" 
            className={`${styles.navLink} ${isActive('/random-facts')}`}
          >
            <span className={styles.navIcon}>🧠</span>
            Animal Facts
          </Link>
        </div>
        
        <div className={styles.navSection}>
          <h3 className={styles.navSectionTitle}>Social</h3>
          <Link 
            href="/dashboard/friends" 
            className={`${styles.navLink} ${isActive('/dashboard/friends')}`}
          >
            <span className={styles.navIcon}>👥</span>
            Friends
          </Link>
          <Link 
            href="/dashboard/leaderboard" 
            className={`${styles.navLink} ${isActive('/dashboard/leaderboard')}`}
          >
            <span className={styles.navIcon}>🏆</span>
            Leaderboard
          </Link>
        </div>
        
        <div className={styles.navSection}>
          <h3 className={styles.navSectionTitle}>Me</h3>
          <Link 
            href="/dashboard/profile" 
            className={`${styles.navLink} ${isActive('/dashboard/profile')}`}
          >
            <span className={styles.navIcon}>👤</span>
            Profile
          </Link>
          <Link 
            href="/dashboard/settings" 
            className={`${styles.navLink} ${isActive('/dashboard/settings')}`}
          >
            <span className={styles.navIcon}>⚙️</span>
            Settings
          </Link>
        </div>
        
        <div className={styles.navFooter}>
          <Link href="/" className={styles.homeLink}>
            <span className={styles.navIcon}>🦁</span>
            Animal Explorer Home
          </Link>
        </div>
      </nav>
    </>
  );
} 