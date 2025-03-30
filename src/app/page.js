'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './page.module.css';
import { useRouter } from 'next/navigation';

// Featured animals data
const animals = [
  {
    name: 'Lion',
    emoji: '🦁',
    color: '#f9a825',
    fact: 'A lion\'s roar can be heard from up to 5 miles away!',
    tags: ['Mammals', 'Africa', 'Predator']
  },
  {
    name: 'Elephant',
    emoji: '🐘',
    color: '#78909c',
    fact: 'Elephants can recognize themselves in a mirror, showing self-awareness.',
    tags: ['Mammals', 'Africa', 'Herbivore']
  },
  {
    name: 'Penguin',
    emoji: '🐧',
    color: '#42a5f5',
    fact: 'Emperor penguins can dive up to 1,850 feet deep in the ocean.',
    tags: ['Birds', 'Antarctica', 'Swimmer']
  },
  {
    name: 'Tiger',
    emoji: '🐯',
    color: '#ff7043',
    fact: 'No two tigers have exactly the same stripe pattern - it\'s like a fingerprint!',
    tags: ['Mammals', 'Asia', 'Endangered']
  },
  {
    name: 'Dolphin',
    emoji: '🐬',
    color: '#29b6f6',
    fact: 'Dolphins sleep with one half of their brain at a time to continue breathing.',
    tags: ['Mammals', 'Ocean', 'Intelligent']
  }
];

export default function HomePage() {
  const router = useRouter();
  const [showWelcome, setShowWelcome] = useState(false);
  const [animateBackground, setAnimateBackground] = useState(false);
  const [activeAnimal, setActiveAnimal] = useState(0);
  const welcomeTimerRef = useRef(null);

  useEffect(() => {
    // Check if this is the first visit (using localStorage instead of sessionStorage)
    const hasSeenWelcome = localStorage.getItem('hasSeenWelcome');
    
    if (!hasSeenWelcome) {
      // First visit, show welcome screen
      setShowWelcome(true);
      
      // Set flag in localStorage
      localStorage.setItem('hasSeenWelcome', 'true');
      
      // Hide welcome screen after 3 seconds
      welcomeTimerRef.current = setTimeout(() => {
        setShowWelcome(false);
        setAnimateBackground(true);
      }, 3000);
    } else {
      // Not first visit, skip welcome screen and just animate background
      setShowWelcome(false); // Explicitly set to false to prevent any flash
      setAnimateBackground(true);
    }

    // Rotate featured animal every 5 seconds
    const animalTimer = setInterval(() => {
      setActiveAnimal((prev) => (prev + 1) % animals.length);
    }, 5000);

    return () => {
      if (welcomeTimerRef.current) clearTimeout(welcomeTimerRef.current);
      clearInterval(animalTimer);
    };
  }, []);

  // Set the active animal background color for the card
  const activeAnimalColor = animals[activeAnimal].color;

  return (
    <div className={`${styles.wildHomepage} ${animateBackground ? styles.animateBackground : ''}`}
         style={{ backgroundImage: `url('/animal-pattern-bg.svg')` }}>
      
      {/* Welcome Overlay */}
      {showWelcome && (
        <div className={styles.welcomeOverlay}>
          <div className={styles.welcomeContent}>
            <div className={styles.logoContainer}>
              <span style={{ fontSize: '4rem' }}>🦁</span>
            </div>
            <h1>Welcome to Animal Explorer</h1>
            <p>Your adventure into the animal kingdom begins now!</p>
            <div className={styles.loadingPaw}>
              <div className={styles.pawDot}></div>
              <div className={styles.pawDot}></div>
              <div className={styles.pawDot}></div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className={styles.mainContent}>
        {/* Header */}
        <header className={styles.homeHeader}>
          <Link href="/" className={styles.logo}>
            <span style={{ fontSize: '2rem' }}>🦁</span>
            <h1>Animal Explorer</h1>
          </Link>
          <nav className={styles.homeNav}>
            <Link href="/random-facts" className={styles.navLink}>Animal Facts</Link>
            <Link href="/login" className={styles.navLink}>Login</Link>
            <Link href="/signup" className={styles.authButton}>Sign Up</Link>
          </nav>
        </header>

        {/* Hero Section */}
        <section className={styles.heroSection}>
          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}>
              Explore the <span className={styles.highlight}>Wild</span> World
            </h1>
            <p className={styles.heroText}>
              Embark on a journey through the animal kingdom. Learn fascinating facts, 
              take fun quizzes, and build your own collection of animal knowledge.
            </p>
            <div className={styles.heroCta}>
              <button 
                className={styles.primaryButton}
                onClick={() => router.push('/signup')}
              >
                Start Exploring
              </button>
              <button 
                className={styles.secondaryButton}
                onClick={() => router.push('/random-facts')}
              >
                Discover Facts
              </button>
              <button 
                className={styles.secondaryButton}
                onClick={() => router.push('/quiz')}
              >
                Collect Animals
              </button>
            </div>
          </div>
          <div className={styles.animalDecorations}>
            {animals.map((animal, index) => (
              <div 
                key={animal.name}
                className={`${styles.animalDecoration} ${index === activeAnimal ? styles.activeAnimal : ''}`}
              >
                <span className={styles.animalEmoji}>{animal.emoji}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Featured Animal */}
        <section className={styles.featuredAnimal}>
          <div className={styles.animalCard} style={{ borderColor: activeAnimalColor }}>
            <div className={styles.animalHeader}>
              <h2 style={{ color: activeAnimalColor }}>{animals[activeAnimal].name}</h2>
              <span className={styles.animalEmoji}>{animals[activeAnimal].emoji}</span>
            </div>
            <div className={styles.animalInfo}>
              <p className={styles.animalFact}>{animals[activeAnimal].fact}</p>
              <div className={styles.animalDetailsTags}>
                {animals[activeAnimal].tags.map(tag => (
                  <span key={tag} className={styles.animalTag}>{tag}</span>
                ))}
              </div>
            </div>
          </div>
          <div className={styles.animalNavigation}>
            {animals.map((animal, index) => (
              <button
                key={animal.name}
                className={`${styles.animalNavButton} ${index === activeAnimal ? styles.activeNavButton : ''}`}
                style={index === activeAnimal ? { backgroundColor: animal.color } : {}}
                onClick={() => setActiveAnimal(index)}
              >
                <span>{animal.emoji}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Features Section */}
        <section className={styles.featuresSection}>
          <h2 className={styles.sectionTitle}>What You'll Find</h2>
          <div className={styles.featuresGrid}>
            <div className={styles.featureCard}>
              <span className={styles.featureIcon}>🔍</span>
              <h3>Animal Encyclopedia</h3>
              <p>Explore detailed information about hundreds of animals from across the globe.</p>
            </div>
            <div className={styles.featureCard}>
              <span className={styles.featureIcon}>🎮</span>
              <h3>Fun Quizzes</h3>
              <p>Test your knowledge with interactive quizzes and challenge your friends.</p>
            </div>
            <div className={styles.featureCard}>
              <span className={styles.featureIcon}>📚</span>
              <h3>Fact Collection</h3>
              <p>Build your own collection of fascinating animal facts and trivia.</p>
            </div>
            <div className={styles.featureCard}>
              <span className={styles.featureIcon}>🏆</span>
              <h3>Achievement Badges</h3>
              <p>Earn badges as you learn and complete challenges.</p>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className={styles.homeFooter}>
          <div className={styles.footerContent}>
            <p>© 2025 Animal Explorer. All rights reserved.</p>
            <div className={styles.footerLinks}>
              <Link href="/random-facts">Animal Facts</Link>
              <Link href="/login">Login</Link>
              <Link href="/signup">Sign Up</Link>
            </div>
          </div>
          <div className={styles.footerPaws}></div>
        </footer>
      </div>
    </div>
  );
}