'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from './random-facts.module.css';
import { useAuth } from '../context/AuthContext';

export default function RandomFactsPage() {
  const [loading, setLoading] = useState(true);
  const [facts, setFacts] = useState([]);
  const [randomFact, setRandomFact] = useState(null);
  const { user } = useAuth();
  const router = useRouter();
  
  const animalFacts = [
    {
      id: 1,
      animal: 'Elephant',
      title: 'Memory Masters',
      fact: 'Elephants have the largest brain of any land animal and an incredible memory. They can remember specific locations for up to 50 years and can recognize over 200 different elephants.',
      icon: '🐘',
      color: '#76b5c5'
    },
    {
      id: 2,
      animal: 'Giraffe',
      title: 'Heart Pumping',
      fact: 'Giraffes have the highest blood pressure of any animal. Their hearts can be 2 feet long and weigh up to 25 pounds to pump blood all the way up their long necks.',
      icon: '🦒',
      color: '#e6b566'
    },
    {
      id: 3,
      animal: 'Tiger',
      title: 'Striped Skin',
      fact: "Tigers have striped skin, not just striped fur! If you shaved a tiger, you would still see its stripes. Each tiger's stripes are unique, like human fingerprints.",
      icon: '🐯',
      color: '#e67e22'
    },
    {
      id: 4,
      animal: 'Penguin',
      title: 'High Jumpers',
      fact: "Penguins can jump as high as 6 feet out of water. They do this to avoid predators like leopard seals when they're surfacing for air.",
      icon: '🐧',
      color: '#34495e'
    },
    {
      id: 5,
      animal: 'Koala',
      title: 'Sleepy Creatures',
      fact: 'Koalas sleep up to 20 hours a day! Their diet of eucalyptus leaves provides very little energy, so they conserve energy by sleeping most of the time.',
      icon: '🐨',
      color: '#7f8c8d'
    },
    {
      id: 6,
      animal: 'Cheetah',
      title: 'Speed Champions',
      fact: 'Cheetahs can accelerate from 0 to 60 mph in just 3 seconds. Their bodies are specially adapted for speed with flexible spines, oversized hearts, and wide nostrils.',
      icon: '🐆',
      color: '#d35400'
    },
    {
      id: 7,
      animal: 'Octopus',
      title: 'Intelligent Invertebrates',
      fact: 'Octopuses have 9 brains - a central brain and 8 mini-brains (one in each arm). They can solve puzzles, use tools, and even escape from aquariums back to the ocean.',
      icon: '🐙',
      color: '#8e44ad'
    },
    {
      id: 8,
      animal: 'Hummingbird',
      title: 'Heart Rate Records',
      fact: "A hummingbird's heart beats up to 1,260 times per minute. They also have the highest metabolism of any animal, and must eat more than their own weight in nectar each day.",
      icon: '🐦',
      color: '#27ae60'
    },
    {
      id: 9,
      animal: 'Polar Bear',
      title: 'Hidden Colors',
      fact: "Polar bears have black skin underneath their white fur. Their fur isn't actually white—it's transparent and reflects visible light, making it appear white.",
      icon: '🐻‍❄️',
      color: '#3498db'
    },
    {
      id: 10,
      animal: 'Chameleon',
      title: 'Color Changers',
      fact: "Chameleons don't change color to match their surroundings. Instead, they change color to regulate temperature, communicate emotions, and attract mates.",
      icon: '🦎',
      color: '#2ecc71'
    },
    {
      id: 11,
      animal: 'Dolphin',
      title: 'Half-Brain Sleepers',
      fact: 'Dolphins sleep with only half their brain at a time. The other half stays alert to watch for predators and signal when to surface for air.',
      icon: '🐬',
      color: '#3498db'
    },
    {
      id: 12,
      animal: 'Parrot',
      title: 'Vocabulary Champions',
      fact: 'An African grey parrot named Alex was trained to recognize about 100 words, colors, shapes, and could express desires like wanting a certain food or toy.',
      icon: '🦜',
      color: '#e74c3c'
    }
  ];
  
  // Generate a random fact
  const generateRandomFact = () => {
    const randomIndex = Math.floor(Math.random() * animalFacts.length);
    setRandomFact(animalFacts[randomIndex]);
  };
  
  // Initialize
  useEffect(() => {
    // Protect this route - redirect if not logged in
    if (!user) {
      router.push('/login');
    } else {
      setFacts(animalFacts);
      generateRandomFact();
      setLoading(false);
    }
  }, [user, router]);
  
  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
        <p>Gathering facts from the animal kingdom...</p>
      </div>
    );
  }
  
  return (
    <div className={styles.container}>
      <header className={styles.pageHeader}>
        <div className={styles.headerContent}>
          <h1>Animal Facts Explorer</h1>
          <p>Discover amazing facts about animals from around the world</p>
        </div>
        <Link href="/dashboard" className={styles.backButton}>
          Back to Dashboard
        </Link>
      </header>
      
      <section className={styles.randomFactSection}>
        <h2>Random Fact Generator</h2>
        <div className={styles.factCard} style={{borderColor: randomFact?.color}}>
          <div className={styles.factCardIcon} style={{backgroundColor: randomFact?.color}}>
            <span>{randomFact?.icon}</span>
          </div>
          <div className={styles.factCardContent}>
            <div className={styles.factAnimal}>{randomFact?.animal}</div>
            <h3>{randomFact?.title}</h3>
            <p>{randomFact?.fact}</p>
          </div>
        </div>
        <button 
          className={styles.generateButton}
          onClick={generateRandomFact}
        >
          Generate New Fact
        </button>
      </section>
      
      <section className={styles.allFactsSection}>
        <h2>All Animal Facts</h2>
        <div className={styles.factGrid}>
          {facts.map(fact => (
            <div 
              key={fact.id} 
              className={styles.factGridItem}
              style={{borderColor: fact.color}}
            >
              <div className={styles.factGridIcon} style={{backgroundColor: fact.color}}>
                {fact.icon}
              </div>
              <h3>{fact.animal}</h3>
              <p>{fact.fact}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
} 