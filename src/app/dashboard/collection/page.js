'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAuth } from '../../context/AuthContext';
import styles from '../components/Components.module.css';

export default function MyCollection() {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [animals, setAnimals] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All Animals');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAnimal, setSelectedAnimal] = useState(null);
  const [viewMode, setViewMode] = useState('grid');
  
  const animalCategories = [
    'All Animals',
    'Mammals',
    'Birds',
    'Reptiles',
    'Amphibians',
    'Fish',
    'Insects'
  ];
  
  // Sample animal data - in a real app, this would come from your database
  const sampleAnimals = [
    {
      id: 1,
      name: 'African Lion',
      scientificName: 'Panthera leo',
      category: 'Mammals',
      rarity: 'Common',
      discovered: '2023-12-15',
      image: '/animals/lion.jpg',
      description: 'The lion is one of the big cats in the genus Panthera and a member of the family Felidae. The commonly used term African lion collectively denotes the several subspecies in Africa.',
      habitat: 'Savanna, grassland, dense scrub',
      diet: 'Carnivore',
      lifespan: '10-14 years',
      funFact: 'Lion cubs are born with spots that disappear as they grow older.'
    },
    {
      id: 2,
      name: 'Emperor Penguin',
      scientificName: 'Aptenodytes forsteri',
      category: 'Birds',
      rarity: 'Uncommon',
      discovered: '2023-11-05',
      image: '/animals/penguin.jpg',
      description: 'The emperor penguin is the tallest and heaviest of all living penguin species and is endemic to Antarctica.',
      habitat: 'Antarctic sea ice',
      diet: 'Carnivore (fish, squid, krill)',
      lifespan: '15-20 years',
      funFact: 'Male emperor penguins keep their eggs warm by balancing them on their feet and covering them with a feathered pouch.'
    },
    {
      id: 3,
      name: 'African Elephant',
      scientificName: 'Loxodonta africana',
      category: 'Mammals',
      rarity: 'Uncommon',
      discovered: '2023-10-20',
      image: '/animals/elephant.jpg',
      description: 'The African elephant is the largest living terrestrial animal with bull elephants reaching a shoulder height of up to 4 m.',
      habitat: 'Savanna, forest, desert, marshes',
      diet: 'Herbivore',
      lifespan: '60-70 years',
      funFact: 'Elephants can recognize themselves in a mirror, showing self-awareness.'
    },
    {
      id: 4,
      name: 'Giraffe',
      scientificName: 'Giraffa camelopardalis',
      category: 'Mammals',
      rarity: 'Common',
      discovered: '2024-01-10',
      image: '/animals/giraffe.jpg',
      description: 'The giraffe is a tall African hoofed mammal belonging to the genus Giraffa. It is the tallest living terrestrial animal and the largest ruminant on Earth.',
      habitat: 'Savanna, woodland',
      diet: 'Herbivore',
      lifespan: '25 years',
      funFact: 'Giraffes sleep for only about 30 minutes to 2 hours a day.'
    },
    {
      id: 5,
      name: 'Poison Dart Frog',
      scientificName: 'Dendrobatidae',
      category: 'Amphibians',
      rarity: 'Rare',
      discovered: '2024-02-01',
      image: '/animals/frog.jpg',
      description: 'Poison dart frogs are a group of frogs native to tropical Central and South America. These frogs are well known for their bright colors and patterns combined with toxic skin secretions.',
      habitat: 'Tropical rainforests',
      diet: 'Carnivore (insects)',
      lifespan: '3-15 years',
      funFact: 'The poison from just one golden poison dart frog could kill up to 20,000 mice.'
    },
    {
      id: 6,
      name: 'Bengal Tiger',
      scientificName: 'Panthera tigris tigris',
      category: 'Mammals',
      rarity: 'Rare',
      discovered: '2024-01-25',
      image: '/animals/tiger.jpg',
      description: 'The Bengal tiger is a tiger subspecies native to the Indian subcontinent. It is threatened by poaching, loss, and fragmentation of habitat.',
      habitat: 'Tropical and subtropical moist broadleaf forests',
      diet: 'Carnivore',
      lifespan: '8-10 years in the wild, up to 20 in captivity',
      funFact: 'No two tigers have the same stripes, they are as unique as human fingerprints.'
    },
    {
      id: 7,
      name: 'Zebra',
      scientificName: 'Equus quagga',
      category: 'Mammals',
      rarity: 'Common',
      discovered: '2023-09-12',
      image: '/animals/zebra.jpg',
      description: 'Zebras are African equines with distinctive black-and-white striped coats.',
      habitat: 'Grasslands, savannas',
      diet: 'Herbivore',
      lifespan: '20-30 years',
      funFact: 'Every zebra has a unique pattern of stripes, much like a human fingerprint.'
    }
  ];
  
  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    
    // Get collected animals from localStorage
    const storedAnimals = localStorage.getItem('collectedAnimals');
    let quizCollectedAnimals = [];
    
    if (storedAnimals) {
      try {
        quizCollectedAnimals = JSON.parse(storedAnimals);
        console.log('Found collected animals:', quizCollectedAnimals);
      } catch (error) {
        console.error('Error parsing collected animals:', error);
      }
    }
    
    // Convert quiz animals to the collection format
    const quizAnimals = quizCollectedAnimals.map(animal => {
      // Find the corresponding sample animal
      const matchingSample = sampleAnimals.find(sample => 
        sample.name.toLowerCase().includes(animal.name.toLowerCase()) || 
        animal.name.toLowerCase().includes(sample.name.toLowerCase())
      );
      
      if (matchingSample) {
        return {
          ...matchingSample,
          collectedOn: animal.collectedOn,
          source: 'Quiz'
        };
      }
      
      // If no match, create a basic entry
      return {
        id: animal.id || Math.random().toString(36).substring(2),
        name: animal.name,
        scientificName: 'Collected from quiz',
        category: 'Mammals',
        rarity: 'Uncommon',
        discovered: animal.collectedOn || new Date().toISOString(),
        image: animal.image,
        description: 'This animal was collected by completing a quiz with a perfect score!',
        habitat: 'Various',
        diet: 'Various',
        lifespan: 'Unknown',
        funFact: 'You collected this animal by acing a quiz!',
        source: 'Quiz'
      };
    });
    
    // Combine sample animals with quiz collected animals, avoiding duplicates
    const combinedAnimals = [...sampleAnimals];
    
    quizAnimals.forEach(quizAnimal => {
      const exists = combinedAnimals.some(animal => 
        animal.name.toLowerCase() === quizAnimal.name.toLowerCase()
      );
      
      if (!exists) {
        combinedAnimals.push(quizAnimal);
      } else {
        // Update existing animal to mark it as collected from quiz
        const index = combinedAnimals.findIndex(animal => 
          animal.name.toLowerCase() === quizAnimal.name.toLowerCase()
        );
        if (index !== -1) {
          combinedAnimals[index] = {
            ...combinedAnimals[index],
            source: 'Quiz',
            collectedOn: quizAnimal.collectedOn
          };
        }
      }
    });
    
    // Simulate loading animal data
    setTimeout(() => {
      setAnimals(combinedAnimals);
      setLoading(false);
    }, 1000);
  }, [user, router]);
  
  const handleAnimalClick = (animal) => {
    setSelectedAnimal(animal);
  };
  
  const closeAnimalDetails = () => {
    setSelectedAnimal(null);
  };
  
  // Filter animals based on category and search query
  const filteredAnimals = animals.filter(animal => {
    const matchesCategory = selectedCategory === 'All Animals' || animal.category === selectedCategory;
    const matchesSearch = animal.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         animal.scientificName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });
  
  // Get collection stats
  const getCollectionStats = () => {
    const total = animals.length;
    const mammals = animals.filter(animal => animal.category === 'Mammals').length;
    const birds = animals.filter(animal => animal.category === 'Birds').length;
    const reptiles = animals.filter(animal => animal.category === 'Reptiles').length;
    const amphibians = animals.filter(animal => animal.category === 'Amphibians').length;
    const fish = animals.filter(animal => animal.category === 'Fish').length;
    const insects = animals.filter(animal => animal.category === 'Insects').length;
    
    const completion = Math.round((total / 50) * 100); // Assuming 50 total animals in the game
    
    return {
      total,
      mammals,
      birds,
      reptiles,
      amphibians,
      fish,
      insects,
      completion
    };
  };
  
  const stats = getCollectionStats();
  
  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
        <p>Loading your collection...</p>
      </div>
    );
  }
  
  return (
    <div className={styles.collectionContainer}>
      <header className={styles.collectionHeader}>
        <h1>My Animal Collection</h1>
        <p>Explore the animals you've discovered on your adventure</p>
      </header>
      
      <div className={styles.collectionSummary}>
        <div className={styles.summaryCard}>
          <div className={styles.summaryIcon}>🏆</div>
          <div className={styles.summaryCount}>{stats.total}</div>
          <div className={styles.summaryLabel}>Total Animals</div>
        </div>
        
        <div className={styles.progressContainer}>
          <h3>Collection Progress</h3>
          <div className={styles.progressBar}>
            <div 
              className={styles.progressFill} 
              style={{ width: `${stats.completion}%` }}
            ></div>
            <span className={styles.progressText}>{stats.completion}%</span>
          </div>
        </div>
      </div>
      
      <div className={styles.collectionTools}>
        <div className={styles.searchBar}>
          <input
            type="text"
            placeholder="Search animals..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchInput}
          />
          <span className={styles.searchIcon}>🔍</span>
        </div>
        
        <div className={styles.filterOptions}>
          <div className={styles.viewToggle}>
            <button 
              className={`${styles.viewButton} ${viewMode === 'grid' ? styles.active : ''}`}
              onClick={() => setViewMode('grid')}
            >
              Grid
            </button>
            <button 
              className={`${styles.viewButton} ${viewMode === 'list' ? styles.active : ''}`}
              onClick={() => setViewMode('list')}
            >
              List
            </button>
          </div>
        </div>
      </div>
      
      <div className={styles.categoryFilter}>
        {animalCategories.map(category => (
          <button
            key={category}
            className={`${styles.categoryButton} ${selectedCategory === category ? styles.active : ''}`}
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>
      
      {filteredAnimals.length === 0 ? (
        <div className={styles.noResults}>
          <div className={styles.noResultsIcon}>🔎</div>
          <h3>No animals found</h3>
          <p>Try adjusting your search or category filter</p>
        </div>
      ) : (
        <div className={viewMode === 'grid' ? styles.animalGrid : styles.animalList}>
          {filteredAnimals.map(animal => (
            <div 
              key={animal.id} 
              className={viewMode === 'grid' ? styles.animalCard : styles.animalRow}
              onClick={() => handleAnimalClick(animal)}
            >
              <div className={styles.animalImageContainer}>
                <div 
                  className={styles.animalImage}
                  style={{ backgroundImage: `url(${animal.image})` }}
                >
                  <div className={styles.animalRarity} data-rarity={animal.rarity.toLowerCase()}>
                    {animal.rarity}
                  </div>
                </div>
              </div>
              
              <div className={styles.animalInfo}>
                <h3 className={styles.animalName}>{animal.name}</h3>
                {viewMode === 'grid' && <p className={styles.scientificName}>{animal.scientificName}</p>}
                <div className={styles.animalCategory}>{animal.category}</div>
                {viewMode === 'list' && (
                  <>
                    <p className={styles.scientificName}>{animal.scientificName}</p>
                    <p className={styles.discoveryDate}>Discovered: {new Date(animal.discovered).toLocaleDateString()}</p>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Animal Detail Modal */}
      {selectedAnimal && (
        <div className={styles.modalOverlay} onClick={closeAnimalDetails}>
          <div className={styles.animalModal} onClick={(e) => e.stopPropagation()}>
            <button className={styles.closeButton} onClick={closeAnimalDetails}>×</button>
            
            <div className={styles.modalHeader}>
              <h2>{selectedAnimal.name}</h2>
              <span className={styles.modalRarity} data-rarity={selectedAnimal.rarity.toLowerCase()}>
                {selectedAnimal.rarity}
              </span>
            </div>
            
            <div className={styles.modalContent}>
              <div className={styles.modalImageContainer}>
                <div 
                  className={styles.modalImage}
                  style={{ backgroundImage: `url(${selectedAnimal.image})` }}
                ></div>
              </div>
              
              <div className={styles.animalDetails}>
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>Scientific Name:</span>
                  <span className={styles.detailValue}>{selectedAnimal.scientificName}</span>
                </div>
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>Category:</span>
                  <span className={styles.detailValue}>{selectedAnimal.category}</span>
                </div>
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>Habitat:</span>
                  <span className={styles.detailValue}>{selectedAnimal.habitat}</span>
                </div>
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>Diet:</span>
                  <span className={styles.detailValue}>{selectedAnimal.diet}</span>
                </div>
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>Lifespan:</span>
                  <span className={styles.detailValue}>{selectedAnimal.lifespan}</span>
                </div>
                <div className={styles.detailRow}>
                  <span className={styles.detailLabel}>Discovered:</span>
                  <span className={styles.detailValue}>{new Date(selectedAnimal.discovered).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
            
            <div className={styles.animalDescription}>
              <h3>About</h3>
              <p>{selectedAnimal.description}</p>
            </div>
            
            <div className={styles.funFact}>
              <div className={styles.funFactIcon}>💡</div>
              <div className={styles.funFactContent}>
                <h4>Fun Fact</h4>
                <p>{selectedAnimal.funFact}</p>
              </div>
            </div>
            
            <div className={styles.modalActions}>
              <button className={styles.factCardButton}>
                <span className={styles.factCardIcon}>📋</span>
                View Fact Card
              </button>
              <button className={styles.shareButton}>
                <span className={styles.shareIcon}>🔗</span>
                Share
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 