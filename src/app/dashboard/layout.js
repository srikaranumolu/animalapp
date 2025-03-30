'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Image from 'next/image';
import styles from './DashboardLayout.module.css';
import DashboardNavigation from './navigation';

export default function DashboardLayout({ children }) {
  const { user } = useAuth();
  const [userName, setUserName] = useState('Explorer');
  const [userAvatar, setUserAvatar] = useState('/animal-avatar.svg');
  
  useEffect(() => {
    if (user) {
      setUserName(user.displayName || 'Explorer');
      setUserAvatar(user.photoURL || '/animal-avatar.svg');
    }
  }, [user]);
  
  return (
    <div className={styles.dashboardLayout}>
      <aside className={styles.sidebar}>
        <div className={styles.profileSection}>
          <div className={styles.profileImageContainer}>
            <Image
              src={userAvatar}
              alt="User avatar"
              width={80}
              height={80}
              className={styles.profileImage}
            />
          </div>
          <h2 className={styles.userName}>{userName}</h2>
        </div>
        
        <DashboardNavigation />
      </aside>
      
      <main className={styles.mainContent}>
        {children}
      </main>
    </div>
  );
} 