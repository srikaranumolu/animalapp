'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '../context/AuthContext';
import styles from './Quiz.module.css';

// Sample animal quizzes
const animalQuizzes = [
  {
    id: 1,
    animal: 'Lion',
    image: '/animals/lion.jpg',
    questions: [
      {
        question: 'What is the average lifespan of a lion in the wild?',
        options: ['5-8 years', '10-14 years', '15-20 years', '25-30 years'],
        correctAnswer: '10-14 years'
      },
      {
        question: 'Which of these is a characteristic of male lions?',
        options: ['Hunting in packs', 'Having a mane', 'Being smaller than females', 'Living solitary lives'],
        correctAnswer: 'Having a mane'
      },
      {
        question: 'What is a group of lions called?',
        options: ['Pack', 'Herd', 'Pride', 'Colony'],
        correctAnswer: 'Pride'
      },
      {
        question: 'What percentage of a lion\'s hunting is done by females?',
        options: ['50%', '70%', '90%', '30%'],
        correctAnswer: '90%'
      },
      {
        question: 'How many hours can lions spend sleeping each day?',
        options: ['5-8 hours', '10-12 hours', '16-20 hours', '22-24 hours'],
        correctAnswer: '16-20 hours'
      }
    ]
  },
  {
    id: 2,
    animal: 'Elephant',
    image: '/animals/elephant.jpg',
    questions: [
      {
        question: 'How much can an adult elephant eat in a day?',
        options: ['50-100 pounds', '100-150 pounds', '150-300 pounds', '300-600 pounds'],
        correctAnswer: '300-600 pounds'
      },
      {
        question: 'Which of these is NOT a characteristic of elephants?',
        options: ['They have excellent memory', 'They can use tools', 'They are carnivores', 'They communicate through infrasound'],
        correctAnswer: 'They are carnivores'
      },
      {
        question: 'How long is an elephant pregnancy?',
        options: ['9 months', '12 months', '18-22 months', '2-3 years'],
        correctAnswer: '18-22 months'
      },
      {
        question: 'How many muscles does an elephant trunk contain?',
        options: ['Around 10,000', 'Around 40,000', 'Around 100,000', 'Around 150,000'],
        correctAnswer: 'Around 40,000'
      },
      {
        question: 'What is unique about elephant skin?',
        options: ['It never gets sunburned', 'It is bullet-proof', 'It can hold up to 10 gallons of water', 'It is covered in tiny wrinkles to help stay cool'],
        correctAnswer: 'It is covered in tiny wrinkles to help stay cool'
      }
    ]
  },
  {
    id: 3,
    animal: 'Penguin',
    image: '/animals/penguin.jpg',
    questions: [
      {
        question: 'Which of these penguin species is the largest?',
        options: ['King Penguin', 'Emperor Penguin', 'Adélie Penguin', 'Chinstrap Penguin'],
        correctAnswer: 'Emperor Penguin'
      },
      {
        question: 'How do emperor penguins keep their eggs warm?',
        options: ['They build nests', 'They balance eggs on their feet and cover with feathered skin', 'They bury eggs in snow', 'They take turns sitting on nests'],
        correctAnswer: 'They balance eggs on their feet and cover with feathered skin'
      },
      {
        question: 'What adaptation helps penguins swim so efficiently?',
        options: ['Webbed feet', 'Streamlined body shape', 'Wing-like flippers', 'All of the above'],
        correctAnswer: 'All of the above'
      },
      {
        question: 'How deep can Emperor penguins dive?',
        options: ['Up to 100 feet', 'Up to 500 feet', 'Up to 1,000 feet', 'Up to 1,800 feet'],
        correctAnswer: 'Up to 1,800 feet'
      },
      {
        question: 'What color is penguin urine?',
        options: ['Yellow', 'Clear', 'Red', 'They don\'t produce urine'],
        correctAnswer: 'They don\'t produce urine'
      }
    ]
  },
  {
    id: 4,
    animal: 'Giraffe',
    image: '/animals/giraffe.jpg',
    questions: [
      {
        question: 'How tall can adult male giraffes grow?',
        options: ['10-12 feet', '14-16 feet', '18-20 feet', 'Over 20 feet'],
        correctAnswer: '18-20 feet'
      },
      {
        question: "How long is a giraffe's tongue?",
        options: ['10-15 inches', '15-20 inches', '20-25 inches', '25-30 inches'],
        correctAnswer: '20-25 inches'
      },
      {
        question: "What color is a giraffe's tongue?",
        options: ['Pink', 'Red', 'Blue-black', 'Yellow'],
        correctAnswer: 'Blue-black'
      },
      {
        question: "How many vertebrae are in a giraffe's neck?",
        options: ['4', '7', '12', '15'],
        correctAnswer: '7'
      },
      {
        question: "How do giraffes sleep?",
        options: ['Standing up', 'Lying down for 8 hours', 'Short naps totaling less than 2 hours daily', 'Hanging from trees'],
        correctAnswer: 'Short naps totaling less than 2 hours daily'
      }
    ]
  },
  {
    id: 5,
    animal: 'Frog',
    image: '/animals/frog.jpg',
    questions: [
      {
        question: 'Which of these statements about frogs is true?',
        options: ['All frogs are poisonous', "Frogs don't need to drink water", 'All frogs can jump', 'Frogs shed their skin regularly'],
        correctAnswer: 'Frogs shed their skin regularly'
      },
      {
        question: 'What is a group of frogs called?',
        options: ['A colony', 'An army', 'A knot', 'A leap'],
        correctAnswer: 'An army'
      },
      {
        question: 'How do most frogs catch their prey?',
        options: ['With their sticky tongues', 'By chasing them', 'By using their front legs', 'By setting traps'],
        correctAnswer: 'With their sticky tongues'
      },
      {
        question: 'What unusual feature do some glass frogs have?',
        options: ['They can change color like chameleons', 'They have transparent skin showing internal organs', 'They can breathe underwater permanently', 'They have no eyes'],
        correctAnswer: 'They have transparent skin showing internal organs'
      },
      {
        question: 'Which of the following is true about frog eyes?',
        options: ['They can only see in black and white', 'They can see in the dark better than cats', 'They help push food down when swallowing', 'They cannot blink'],
        correctAnswer: 'They help push food down when swallowing'
      }
    ]
  }
];

export default function QuizPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [quizzes, setQuizzes] = useState([]);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState('');
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [countdown, setCountdown] = useState(15);
  const [timerActive, setTimerActive] = useState(false);
  const [collectedAnimals, setCollectedAnimals] = useState([]);
  const [newlyCollected, setNewlyCollected] = useState(null);

  useEffect(() => {
    // In a real app, you would fetch the user's collected animals from the database
    // For now, just use local state to simulate this
    const storedAnimals = localStorage.getItem('collectedAnimals');
    if (storedAnimals) {
      setCollectedAnimals(JSON.parse(storedAnimals));
    }
    
    setQuizzes(animalQuizzes);
    setLoading(false);
    
    // Add the quiz-page class to the body for styling
    document.body.classList.add('quiz-page');
    
    // Cleanup function to remove the class when component unmounts
    return () => {
      document.body.classList.remove('quiz-page');
    };
  }, []);

  useEffect(() => {
    let timer;
    if (timerActive && countdown > 0) {
      timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
    } else if (timerActive && countdown === 0) {
      handleNextQuestion();
    }
    
    return () => {
      clearTimeout(timer);
    };
  }, [timerActive, countdown]);

  const startQuiz = (quiz) => {
    setSelectedQuiz(quiz);
    setCurrentQuestion(0);
    setScore(0);
    setQuizCompleted(false);
    setSelectedOption('');
    setCountdown(15);
    setTimerActive(true);
  };

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
  };

  const handleNextQuestion = () => {
    // Check if answer is correct
    if (selectedQuiz.questions[currentQuestion].correctAnswer === selectedOption) {
      setScore(score + 1);
    }
    
    // Reset for next question
    setSelectedOption('');
    setCountdown(15);
    
    // Move to next question or end quiz
    if (currentQuestion < selectedQuiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      finishQuiz();
    }
  };

  const finishQuiz = () => {
    setTimerActive(false);
    setQuizCompleted(true);
    
    // If user scored 100%, add animal to collection
    if (score + (selectedOption === selectedQuiz.questions[currentQuestion].correctAnswer ? 1 : 0) === selectedQuiz.questions.length) {
      const animalToAdd = {
        id: selectedQuiz.id,
        name: selectedQuiz.animal,
        image: selectedQuiz.image,
        collectedOn: new Date().toISOString()
      };
      
      // Check if already collected
      if (!collectedAnimals.some(animal => animal.id === animalToAdd.id)) {
        const updatedCollection = [...collectedAnimals, animalToAdd];
        setCollectedAnimals(updatedCollection);
        setNewlyCollected(animalToAdd);
        
        // In a real app, you would save to database
        localStorage.setItem('collectedAnimals', JSON.stringify(updatedCollection));
      }
    }
  };

  const returnToQuizzes = () => {
    setSelectedQuiz(null);
    setNewlyCollected(null);
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingAnimation}>
          <div className={styles.pawprint}></div>
          <div className={styles.pawprint}></div>
          <div className={styles.pawprint}></div>
        </div>
        <p>Loading animal quizzes...</p>
      </div>
    );
  }

  return (
    <div className={styles.quizContainer}>
      <div className={styles.header}>
        <h1>Animal Quizzes</h1>
        {user ? (
          <Link href="/dashboard">Back to Dashboard</Link>
        ) : (
          <Link href="/">Back to Home</Link>
        )}
      </div>
      
      {!selectedQuiz ? (
        <div className={styles.quizSelection}>
          <div className={styles.collectionSummary}>
            <h2>Your Collection</h2>
            <p>You've collected {collectedAnimals.length} out of {quizzes.length} animals!</p>
            <div className={styles.collectionPreview}>
              {collectedAnimals.length > 0 ? (
                collectedAnimals.map(animal => (
                  <div key={animal.id} className={styles.collectionThumbnail}>
                    <Image 
                      src={animal.image} 
                      alt={animal.name} 
                      width={50} 
                      height={50} 
                      className={styles.animalThumbnail}
                    />
                  </div>
                ))
              ) : (
                <p>Complete quizzes to collect animals!</p>
              )}
            </div>
          </div>
          
          <h2>Choose an Animal Quiz</h2>
          <p>Score 100% to collect the animal for your collection!</p>
          
          <div className={styles.quizGrid}>
            {quizzes.map(quiz => {
              const isCollected = collectedAnimals.some(animal => animal.id === quiz.id);
              
              return (
                <div 
                  key={quiz.id} 
                  className={`${styles.quizCard} ${isCollected ? styles.collected : ''}`}
                  onClick={() => startQuiz(quiz)}
                >
                  <div className={styles.quizImageContainer}>
                    <Image 
                      src={quiz.image} 
                      alt={quiz.animal} 
                      width={120} 
                      height={120} 
                      className={styles.quizImage}
                    />
                    {isCollected && (
                      <div className={styles.collectedBadge}>
                        <span>✓ Collected</span>
                      </div>
                    )}
                  </div>
                  <h3>{quiz.animal}</h3>
                  <p>{quiz.questions.length} questions</p>
                  <button className={styles.startButton}>Start Quiz</button>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className={styles.activeQuiz}>
          {!quizCompleted ? (
            <>
              <div className={styles.quizInfo}>
                <div className={styles.quizSubject}>
                  <Image 
                    src={selectedQuiz.image} 
                    alt={selectedQuiz.animal} 
                    width={60} 
                    height={60} 
                    className={styles.quizSubjectImage}
                  />
                  <h2>{selectedQuiz.animal} Quiz</h2>
                </div>
                <div className={styles.quizProgress}>
                  <span>Question {currentQuestion + 1} of {selectedQuiz.questions.length}</span>
                  <div className={styles.progressBar}>
                    <div 
                      className={styles.progressFill} 
                      style={{ width: `${((currentQuestion) / selectedQuiz.questions.length) * 100}%` }}
                    ></div>
                  </div>
                </div>
                <div className={styles.timer}>
                  <span className={countdown < 5 ? styles.warningTime : ''}>
                    {countdown}s
                  </span>
                </div>
              </div>
              
              <div className={styles.questionCard}>
                <h3 className={styles.question}>
                  {selectedQuiz.questions[currentQuestion].question}
                </h3>
                <div className={styles.options}>
                  {selectedQuiz.questions[currentQuestion].options.map((option, index) => (
                    <button
                      key={index}
                      className={`${styles.option} ${selectedOption === option ? styles.selected : ''}`}
                      onClick={() => handleOptionSelect(option)}
                    >
                      {option}
                    </button>
                  ))}
                </div>
                <button 
                  className={styles.nextButton}
                  onClick={handleNextQuestion}
                  disabled={!selectedOption}
                >
                  {currentQuestion === selectedQuiz.questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
                </button>
              </div>
            </>
          ) : (
            <div className={styles.quizResults}>
              <h2>Quiz Completed!</h2>
              
              <div className={styles.scoreCard}>
                <div className={styles.scoreHeader}>
                  <Image 
                    src={selectedQuiz.image} 
                    alt={selectedQuiz.animal} 
                    width={80} 
                    height={80} 
                    className={styles.resultImage}
                  />
                  <h3>{selectedQuiz.animal} Quiz Results</h3>
                </div>
                
                <div className={styles.scoreDetails}>
                  <div className={styles.scoreCircle}>
                    <span className={styles.scoreNumber}>{score}</span>
                    <span className={styles.scoreTotal}>/{selectedQuiz.questions.length}</span>
                  </div>
                  <div className={styles.scoreMessage}>
                    {score === selectedQuiz.questions.length ? (
                      <p className={styles.perfectScore}>Perfect Score! You've collected this animal!</p>
                    ) : (
                      <p>You need a perfect score to collect this animal. Try again!</p>
                    )}
                  </div>
                </div>
              </div>
              
              {newlyCollected && (
                <div className={styles.collectionAnimation}>
                  <div className={styles.newAnimalAlert}>
                    <Image 
                      src={newlyCollected.image} 
                      alt={newlyCollected.name} 
                      width={150} 
                      height={150} 
                      className={styles.newAnimalImage}
                    />
                    <h3>New Animal Collected!</h3>
                    <p>The {newlyCollected.name} has been added to your collection!</p>
                  </div>
                </div>
              )}
              
              <div className={styles.actionButtons}>
                <button 
                  className={styles.retryButton}
                  onClick={() => startQuiz(selectedQuiz)}
                >
                  Try Again
                </button>
                <button 
                  className={styles.homeButton}
                  onClick={returnToQuizzes}
                >
                  More Quizzes
                </button>
                <button 
                  className={styles.collectionButton}
                  onClick={() => router.push('/dashboard/collection')}
                >
                  View Collection
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
} 