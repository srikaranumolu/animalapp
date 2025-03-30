'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './page.module.css';

export default function HomePage() {
  const [activeAnimal, setActiveAnimal] = useState(0);
  const [showWelcome, setShowWelcome] = useState(true);

  // Featured animals with fun facts for kids
  const animals = [
    {
      id: 1,
      name: 'Lion',
      emoji: '🦁',
      color: '#FFD166',
      fact: 'Lions can sleep up to 20 hours a day!',
      difficulty: 'Medium',
      habitat: 'Savanna',
      sound: 'ROAR!',
      image: '/animals/lion.svg'
    },
    {
      id: 2,
      name: 'Elephant',
      emoji: '🐘',
      color: '#118AB2',
      fact: 'Some elephants can recognize themselves in mirrors!',
      difficulty: 'Easy',
      habitat: 'Forest & Savanna',
      sound: 'TRUMPET!',
      image: '/animals/elephant.svg'
    },
    {
      id: 3,
      name: 'Penguin',
      emoji: '🐧',
      color: '#073B4C',
      fact: 'Penguins can jump as high as 6 feet!',
      difficulty: 'Easy',
      habitat: 'Antarctica',
      sound: 'SQUAWK!',
      image: '/animals/penguin.svg'
    },
    {
      id: 4,
      name: 'Giraffe',
      emoji: '🦒',
      color: '#EF476F',
      fact: 'Giraffes only need to sleep 2 hours a day!',
      difficulty: 'Medium',
      habitat: 'Savanna',
      sound: 'HUM!',
      image: '/animals/giraffe.svg'
    },
    {
      id: 5,
      name: 'Frog',
      emoji: '🐸',
      color: '#06D6A0',
      fact: 'Some frogs can jump over 20 times their body length!',
      difficulty: 'Easy',
      habitat: 'Pond',
      sound: 'RIBBIT!',
      image: '/animals/frog.svg'
    }
  ];

  // Auto rotate featured animals
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveAnimal((prev) => (prev + 1) % animals.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [animals.length]);

  // Hide welcome message after 3 seconds
  useEffect(() => {
    const timeout = setTimeout(() => {
      setShowWelcome(false);
    }, 3000);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className={styles.wildHomepage} style={{ backgroundColor: animals[activeAnimal].color + '33' }}>
      {/* Welcome Overlay */}
      {showWelcome && (
        <div className={styles.welcomeOverlay}>
          <div className={styles.welcomeContent}>
            <h1>Welcome to Animal Explorer!</h1>
            <div className={styles.animalParade}>
              {animals.map(animal => (
                <span key={animal.id} className={styles.paradeEmoji}>{animal.emoji}</span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className={styles.wildNav}>
        <Link href="/" className={styles.logo}>
          <div className={styles.logoWrapper}>
            <Image 
              src="/logo.svg" 
              alt="Animal Explorer" 
              width={50} 
              height={50} 
              priority
            />
            <div className={styles.logoText}>
              <span className={styles.logoName}>Animal Explorer</span>
              <span className={styles.logoTagline}>Learn, Play, Discover!</span>
            </div>
          </div>
        </Link>

        <div className={styles.authLinks}>
          <Link href="/login" className={styles.loginBtn}>Login</Link>
          <Link href="/signup" className={styles.signupBtn}>Sign Up</Link>
        </div>
      </nav>

      {/* Hero Section with Animal Carousel */}
      <section className={styles.wildHero}>
        <div className={styles.heroContent}>
          <h1>
            Explore the <span className={styles.highlight}>Animal</span> Kingdom!
          </h1>
          <p className={styles.explorerText} style={{ color: '#FFFFFF' }}>Join thousands of young explorers learning about amazing animals</p>
          
          <div className={styles.heroCallToAction}>
            <Link href="/explore" className={styles.exploreButton}>
              Start Your Adventure
              <span className={styles.btnEmoji}>🔍</span>
            </Link>
            <Link href="/daily-quiz" className={styles.quizButton}>
              Today&apos;s Challenge
              <span className={styles.btnEmoji}>🏆</span>
            </Link>
          </div>
        </div>

        <div className={styles.featuredAnimal} style={{ borderColor: animals[activeAnimal].color }}>
          <div className={styles.animalImageContainer}>
            <Image
              src={animals[activeAnimal].image}
              alt={animals[activeAnimal].name}
              width={350}
              height={350}
              className={styles.animalImage}
            />
            <div className={styles.animalOverlay}>
              <span className={styles.animalEmoji}>{animals[activeAnimal].emoji}</span>
              <h2>{animals[activeAnimal].name}</h2>
              <p className={styles.animalSound}>{animals[activeAnimal].sound}</p>
            </div>
          </div>s
          <div className={styles.subHeader}>
            <span className={styles.factLabel}>Fun Fact:</span>
            <p className={styles.factText} style={{ color: '#4caf50' }}>{animals[activeAnimal].fact}</p>
          </div>
          <div className={styles.animalDots}>
            {animals.map((animal, index) => (
              <button 
                key={animal.id}
                className={`${styles.animalDot} ${index === activeAnimal ? styles.activeDot : ''}`}
                style={{ backgroundColor: index === activeAnimal ? animal.color : 'white' }}
                onClick={() => setActiveAnimal(index)}
                aria-label={`View ${animal.name}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Game Modes Section */}
      <section className={styles.gameModes}>
        <h2 className={styles.sectionTitle}>
          <span className={styles.titleIcon}>🎮</span>
          Play & Learn
          <span className={styles.titleIcon}>📚</span>
        </h2>
        
        <div className={styles.modeCards}>
          <div className={styles.modeCard}>
            <div className={styles.modeIcon}>🌍</div>
            <h3>Explore Mode</h3>
            <p>Discover amazing animals and their habitats</p>
            <Link href="/explore" className={styles.modeButton}>Explore</Link>
          </div>
          
          <div className={styles.modeCard}>
            <div className={styles.modeIcon}>❓</div>
            <h3>Quiz Challenge</h3>
            <p>Test your knowledge with fun animal quizzes</p>
            <Link href="/quiz" className={styles.modeButton}>Take Quiz</Link>
          </div>
          
          <div className={styles.modeCard}>
            <div className={styles.modeIcon}>🎒</div>
            <h3>My Collection</h3>
            <p>View the animals you&apos;ve learned about</p>
            <Link href="/collection" className={styles.modeButton}>View</Link>
          </div>
          
          <div className={styles.modeCard}>
            <div className={styles.modeIcon}>🦒</div>
            <h3>3D Zoo</h3>
            <p>Walk around and pet animals in our virtual zoo</p>
            <Link href="/zoo" className={styles.modeButton}>Visit Zoo</Link>
          </div>
        </div>
      </section>

      {/* Animal Categories */}
      <section className={styles.categories}>
        <h2 className={styles.sectionTitle}>
          <span className={styles.titleIcon}>🦓</span>
          Animal Categories
          <span className={styles.titleIcon}>🐙</span>
        </h2>
        
        <div className={styles.categoryTiles}>
          {[
            { name: 'Mammals', emoji: '🦁', color: '#FFD166' },
            { name: 'Birds', emoji: '🦉', color: '#EF476F' },
            { name: 'Reptiles', emoji: '🐊', color: '#06D6A0' },
            { name: 'Fish', emoji: '🐠', color: '#118AB2' },
            { name: 'Insects', emoji: '🦋', color: '#073B4C' },
            { name: 'Amphibians', emoji: '🐸', color: '#06D6A0' }
          ].map((category, index) => (
            <Link 
              href={`/category/${category.name.toLowerCase()}`} 
              key={index}
              className={styles.categoryTile}
              style={{ backgroundColor: category.color }}
            >
              <span className={styles.categoryEmoji}>{category.emoji}</span>
              <span className={styles.categoryName}>{category.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Daily Challenge */}
      <section className={styles.dailyChallenge}>
        <div className={styles.challengeContent}>
          <div className={styles.challengeBadge}>Daily Challenge</div>
          <h2>Mystery Animal of the Day</h2>
          <p style={{ color: '#000000' }}>Can you guess this animal based on the clues?</p>
          <ul className={styles.clueList} style={{ color: '#895129' }}>
            <li>I have a very long neck</li>
            <li>I&apos;m the tallest land animal</li>
            <li>I have spotted patterns on my body</li>
          </ul>
          <Link href="/daily-challenge" className={styles.challengeButton}>
            Solve the Mystery!
          </Link>
        </div>
        <div className={styles.challengeImage}>
          <Image
            src="/mystery-animal.svg"
            alt="Mystery Animal Silhouette"
            width={200}
            height={200}
          />
        </div>
      </section>

      {/* Footer with Animal Footprints */}
      <footer className={styles.wildFooter}>
        <div className={styles.footprints}></div>
        <div className={styles.footerContent}>
          <p>© 2024 Animal Explorer • Created with ❤️ for young explorers</p>
          <div className={styles.footerLinks}>
            <Link href="/about">About</Link>
            <Link href="/parents">For Parents</Link>
            <Link href="/teachers">For Teachers</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}