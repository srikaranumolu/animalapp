'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import styles from './dashboard.module.css';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [animalTip, setAnimalTip] = useState('');
  
  const { user } = useAuth();
  const router = useRouter();
  
  const animalTips = [
    "Did you know elephants can recognize themselves in mirrors?",
    "Giraffes only need 2 hours of sleep per day!",
    "Penguins can jump as high as 6 feet out of water!",
    "Tigers have striped skin, not just striped fur!",
    "Koalas sleep up to 20 hours a day!"
  ];
  
  // Protect this route - redirect if not logged in
  useEffect(() => {
    if (!user) {
      router.push('/login');
    } else {
      // Simulate fetching user data
      setTimeout(() => {
        setUserData({
          name: user.displayName || 'Explorer',
          email: user.email,
          avatar: user.photoURL || '/animal-avatar.svg',
          level: 3,
          badges: ['Early Explorer', 'Quiz Master', 'Animal Friend'],
          collectionCount: 15,
          animalsSeen: ['Lion', 'Elephant', 'Penguin', 'Giraffe', 'Frog'],
          joinDate: 'January 2024',
          favoriteAnimal: 'Lion'
        });
        
        // Set a random animal tip
        const randomTip = animalTips[Math.floor(Math.random() * animalTips.length)];
        setAnimalTip(randomTip);
        
        setLoading(false);
      }, 1000);
    }
  }, [user, router]);
  
  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
        <p>Tracking animals in the wild...</p>
        <div className={styles.animalTracks}></div>
      </div>
    );
  }
  
  return (
    <div className={styles.homeTab}>
      <header className={styles.welcomeHeader}>
        <div className={styles.headerContent}>
          <div className={styles.welcomeAnimal}>🦁</div>
          <h1>Welcome to your Safari, {userData?.name}!</h1>
          <p>Continue your animal adventure today</p>
          <div className={styles.animalTip}>
            <span className={styles.tipIcon}>💡</span>
            <span style={{color: "#4caf50"}}>{animalTip}</span>
          </div>
        </div>
        <div className={styles.headerDecoration}>
          <div className={styles.confetti}></div>
        </div>
      </header>
      
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>🏆</div>
          <h3>Your Collection</h3>
          <p className={styles.statValue}>{userData?.collectionCount} animals</p>
          <div className={styles.recentAnimals}>
            {userData?.animalsSeen.slice(0, 3).map((animal, index) => (
              <span key={index} className={styles.animalBadge}>{animal}</span>
            ))}
          </div>
          <Link href="/dashboard/collection" className={styles.viewMoreButton}>
            View Collection
          </Link>
        </div>
        
        <div className={styles.statCard}>
          <div className={styles.statIcon}>📊</div>
          <h3>Quiz Score</h3>
          <p className={styles.statValue}>85<span className={styles.statUnit}>%</span></p>
          <div className={styles.quizInfo}>Wildlife expert in the making!</div>
          <Link href="/dashboard/quiz-history" className={styles.viewMoreButton}>
            View Quizzes
          </Link>
        </div>
        
        <div className={styles.statCard}>
          <div className={styles.statIcon}>👥</div>
          <h3>Animal Friends</h3>
          <p className={styles.statValue}>8 explorers</p>
          <div className={styles.friendActivity}>Exploring together is more fun!</div>
          <Link href="/dashboard/social" className={styles.viewMoreButton}>
            View Friends
          </Link>
        </div>
        
        <div className={styles.statCard}>
          <div className={styles.statIcon}>🔔</div>
          <h3>Wild Notifications</h3>
          <p className={styles.statValue}>3 new</p>
          <div className={styles.notifPreview}>New animals to discover!</div>
          <button className={styles.viewMoreButton}>
            View All
          </button>
        </div>
      </div>
      
      <section className={styles.recentActivity}>
        <div className={styles.sectionHeader}>
          <h2>Your Wild Adventures</h2>
          <button className={styles.viewAllButton}>View All</button>
        </div>
        
        <div className={styles.activityList}>
          <div className={styles.activityItem}>
            <div className={styles.activityIcon}>🏆</div>
            <div className={styles.activityContent}>
              <h4>New Badge Earned</h4>
              <p>You earned the "Animal Friend" badge</p>
              <span className={styles.activityTime}>2 days ago</span>
            </div>
          </div>
          
          <div className={styles.activityItem}>
            <div className={styles.activityIcon}>📝</div>
            <div className={styles.activityContent}>
              <h4>Safari Quiz Completed</h4>
              <p>You scored 9/10 on "Animal Habitats"</p>
              <span className={styles.activityTime}>3 days ago</span>
            </div>
          </div>
          
          <div className={styles.activityItem}>
            <div className={styles.activityIcon}>🦁</div>
            <div className={styles.activityContent}>
              <h4>New Species Discovered</h4>
              <p>You added "Lion" to your animal collection</p>
              <span className={styles.activityTime}>1 week ago</span>
            </div>
          </div>
        </div>
      </section>
      
      <section className={styles.dailyChallenge}>
        <div className={styles.challengeCard}>
          <div className={styles.challengeHeader}>
            <h3>Safari Challenge</h3>
            <div className={styles.rewardBadge}>+50 XP</div>
          </div>
          <p>Name 3 animals that live in the Arctic region</p>
          <div className={styles.wildHint}>
            <span className={styles.hintIcon}>❄️</span>
            <span>Hint: Think of animals that survive in extreme cold!</span>
          </div>
          <button className={styles.challengeButton}>Begin Safari</button>
        </div>
      </section>
      
      <section className={styles.randomFactsSection}>
        <div className={styles.factsSectionHeader}>
          <h2>Random Animal Facts</h2>
          <Link href="/random-facts" className={styles.allFactsButton}>
            More Facts
          </Link>
        </div>
        <div className={styles.factCard}>
          <div className={styles.factCardIcon}>🐘</div>
          <div className={styles.factCardContent}>
            <h3>Elephant Memory</h3>
            <p>Elephants can remember specific locations for up to 50 years and can recognize over 200 different elephants.</p>
          </div>
        </div>
      </section>
    </div>
  );
} 