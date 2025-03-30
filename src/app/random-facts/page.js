'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from './RandomFacts.module.css';
import { useAuth } from '../context/AuthContext';

export default function RandomFactsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [facts, setFacts] = useState([]);
  const [randomFact, setRandomFact] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeCategory, setActiveCategory] = useState('All');
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAnimalFacts();
  }, []);

  const fetchAnimalFacts = async () => {
    try {
      setLoading(true);
      // Using the Ninja API for animal facts
      const response = await fetch('https://api.api-ninjas.com/v1/animals?name=', {
        headers: { 
          'X-Api-Key': 'YOUR_API_KEY',
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch animal facts');
      }
      
      const data = await response.json();
      
      // Transform the API response into our fact format
      const processedFacts = data.slice(0, 20).map((animal, index) => {
        const fact = animal.characteristics?.behavior || 
                    animal.characteristics?.diet || 
                    animal.characteristics?.habitat ||
                    'This animal has unique characteristics that make it special in the animal kingdom.';
                    
        return {
          id: index + 1,
          animal: animal.name,
          fact: fact,
          emoji: getAnimalEmoji(animal.name),
          category: animal.taxonomy?.class || 'Unknown'
        };
      });
      
      setFacts(processedFacts);
      generateRandomFact(processedFacts);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching animal facts:', error);
      setError('Failed to load animal facts. Using backup data instead.');
      // Use backup data in case the API fails
      useBackupData();
    }
  };
  
  const useBackupData = () => {
    // Backup animal facts data
    const backupFacts = [
      {
        id: 1,
        animal: 'Lion',
        fact: 'A lion\'s roar can be heard up to 5 miles away and is used to communicate with other pride members.',
        emoji: '🦁',
        category: 'Mammals'
      },
      {
        id: 2,
        animal: 'Elephant',
        fact: 'Elephants can recognize themselves in mirrors, showing self-awareness that few animals possess.',
        emoji: '🐘',
        category: 'Mammals'
      },
      {
        id: 3,
        animal: 'Octopus',
        fact: 'Octopuses have three hearts: two pump blood through the gills, while the third pumps it through the body.',
        emoji: '🐙',
        category: 'Marine'
      },
      {
        id: 4,
        animal: 'Penguin',
        fact: 'Emperor penguins can dive up to 1,850 feet deep, holding their breath for up to 20 minutes.',
        emoji: '🐧',
        category: 'Birds'
      },
      {
        id: 5,
        animal: 'Chameleon',
        fact: 'Chameleons don\'t change color primarily for camouflage, but to regulate body temperature and communicate.',
        emoji: '🦎',
        category: 'Reptiles'
      },
      {
        id: 6,
        animal: 'Hummingbird',
        fact: 'Some hummingbirds can flap their wings up to 80 times per second and are the only birds that can fly backwards.',
        emoji: '🐦',
        category: 'Birds'
      },
      {
        id: 7,
        animal: 'Giraffe',
        fact: 'A giraffe\'s spots are like human fingerprints – no two giraffes have exactly the same pattern.',
        emoji: '🦒',
        category: 'Mammals'
      },
      {
        id: 8,
        animal: 'Koala',
        fact: 'Koalas sleep up to 22 hours a day because their eucalyptus diet requires a lot of energy to digest.',
        emoji: '🐨',
        category: 'Mammals'
      },
      {
        id: 9,
        animal: 'Whale',
        fact: 'The blue whale is the loudest animal on Earth, with vocalizations that can be heard up to 500 miles away.',
        emoji: '🐋',
        category: 'Marine'
      },
      {
        id: 10,
        animal: 'Dolphin',
        fact: 'Dolphins sleep with one half of their brain at a time, allowing them to continue breathing and stay alert.',
        emoji: '🐬',
        category: 'Marine'
      },
      {
        id: 11,
        animal: 'Cheetah',
        fact: 'Cheetahs can accelerate from 0 to 60 mph in just three seconds – faster than most sports cars.',
        emoji: '🐆',
        category: 'Mammals'
      },
      {
        id: 12,
        animal: 'Owl',
        fact: 'Owls can rotate their necks up to 270 degrees without damaging blood vessels or cutting off blood supply.',
        emoji: '🦉',
        category: 'Birds'
      }
    ];
    
    setFacts(backupFacts);
    generateRandomFact(backupFacts);
    setLoading(false);
  };

  const getAnimalEmoji = (animalName) => {
    const emojiMap = {
      'lion': '🦁',
      'elephant': '🐘',
      'tiger': '🐯',
      'bear': '🐻',
      'fox': '🦊',
      'wolf': '🐺',
      'deer': '🦌',
      'giraffe': '🦒',
      'zebra': '🦓',
      'monkey': '🐒',
      'gorilla': '🦍',
      'panda': '🐼',
      'koala': '🐨',
      'penguin': '🐧',
      'bird': '🐦',
      'owl': '🦉',
      'butterfly': '🦋',
      'bee': '🐝',
      'snake': '🐍',
      'turtle': '🐢',
      'crocodile': '🐊',
      'whale': '🐋',
      'dolphin': '🐬',
      'fish': '🐠',
      'octopus': '🐙',
      'crab': '🦀',
      'shark': '🦈',
      'frog': '🐸',
      'rabbit': '🐇',
      'mouse': '🐁',
      'cat': '🐱',
      'dog': '🐶'
    };
    
    // Check if the animal name is in the map or contains any of the keys
    const lowerName = animalName.toLowerCase();
    for (const [key, emoji] of Object.entries(emojiMap)) {
      if (lowerName.includes(key)) {
        return emoji;
      }
    }
    
    // Default emoji if no match is found
    return '🦓';
  };

  const generateRandomFact = (factArray = facts) => {
    setIsGenerating(true);
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * factArray.length);
      setRandomFact(factArray[randomIndex]);
      setIsGenerating(false);
    }, 500); // Add a slight delay for animation effect
  };

  const filterByCategory = (category) => {
    setActiveCategory(category);
    if (category === 'All') {
      setFacts(facts);
    } else {
      const filtered = facts.filter(fact => fact.category === category);
      setFacts(filtered);
    }
  };

  const categories = ['All', ...new Set(facts.map(fact => fact.category))];

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loader}>
          <div className={styles.pawprint}></div>
          <div className={styles.pawprint}></div>
          <div className={styles.pawprint}></div>
        </div>
        <p>Loading animal facts...</p>
      </div>
    );
  }

  return (
    <div className={styles.randomFactsContainer}>
      <div className={styles.backButton}>
        {user ? (
          <Link href="/dashboard">Back to Dashboard</Link>
        ) : (
          <Link href="/">Back to Home</Link>
        )}
      </div>
      
      <h1 className={styles.pageTitle}>Random Animal Facts</h1>
      
      {error && <div className={styles.errorNotice}>{error}</div>}
      
      <div className={styles.randomFactGenerator}>
        <div className={`${styles.factCard} ${isGenerating ? styles.generating : ''}`}>
          {randomFact && (
            <>
              <div className={styles.factHeader}>
                <span className={styles.factEmoji}>{randomFact.emoji}</span>
                <h2>{randomFact.animal}</h2>
                <span className={styles.factCategory}>{randomFact.category}</span>
              </div>
              <p className={styles.factText}>{randomFact.fact}</p>
            </>
          )}
        </div>
        <button 
          className={styles.generateButton} 
          onClick={() => generateRandomFact()}
          disabled={isGenerating}
        >
          {isGenerating ? 'Generating...' : 'Generate New Fact'}
        </button>
      </div>
      
      <div className={styles.factCategories}>
        {categories.map(category => (
          <button 
            key={category}
            className={`${styles.categoryButton} ${activeCategory === category ? styles.activeCategory : ''}`}
            onClick={() => filterByCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>
      
      <div className={styles.allFactsGrid}>
        {facts.map(fact => (
          <div key={fact.id} className={styles.factItem}>
            <div className={styles.factItemHeader}>
              <span className={styles.factItemEmoji}>{fact.emoji}</span>
              <h3>{fact.animal}</h3>
            </div>
            <p>{fact.fact}</p>
            <span className={styles.factItemCategory}>{fact.category}</span>
          </div>
        ))}
      </div>
    </div>
  );
} 