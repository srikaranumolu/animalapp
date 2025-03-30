'use client';

import { useState } from 'react';
import styles from './Components.module.css';

const quizzes = [
  {
    id: 1,
    title: 'Animal Habitats',
    category: 'Ecosystems',
    difficulty: 'Medium',
    score: 9,
    totalQuestions: 10,
    date: '2024-02-10',
    duration: '4:32',
    status: 'completed',
    questions: [
      {
        question: 'Which animal is naturally found in the Arctic?',
        userAnswer: 'Polar Bear',
        correctAnswer: 'Polar Bear',
        isCorrect: true
      },
      {
        question: 'Which habitat do giraffes typically live in?',
        userAnswer: 'Savanna',
        correctAnswer: 'Savanna',
        isCorrect: true
      },
      {
        question: 'Emperor penguins are native to which region?',
        userAnswer: 'Antarctica',
        correctAnswer: 'Antarctica',
        isCorrect: true
      }
    ]
  },
  {
    id: 2,
    title: 'Endangered Species',
    category: 'Conservation',
    difficulty: 'Hard',
    score: 7,
    totalQuestions: 10,
    date: '2024-01-25',
    duration: '6:15',
    status: 'completed',
    questions: [
      {
        question: 'Which big cat is the most endangered?',
        userAnswer: 'Amur Leopard',
        correctAnswer: 'Amur Leopard',
        isCorrect: true
      },
      {
        question: 'What is the primary threat to orangutans?',
        userAnswer: 'Poaching',
        correctAnswer: 'Habitat Loss',
        isCorrect: false
      },
      {
        question: 'Which rhino species went extinct in 2018?',
        userAnswer: 'Northern White Rhino',
        correctAnswer: 'Northern White Rhino',
        isCorrect: true
      }
    ]
  },
  {
    id: 3,
    title: 'Animal Diets',
    category: 'Biology',
    difficulty: 'Easy',
    score: 10,
    totalQuestions: 10,
    date: '2024-01-15',
    duration: '3:45',
    status: 'completed',
    questions: [
      {
        question: 'What do koalas primarily eat?',
        userAnswer: 'Eucalyptus leaves',
        correctAnswer: 'Eucalyptus leaves',
        isCorrect: true
      },
      {
        question: 'Which animal is classified as an omnivore?',
        userAnswer: 'Bear',
        correctAnswer: 'Bear',
        isCorrect: true
      },
      {
        question: 'What is a carnivore?',
        userAnswer: 'An animal that eats only meat',
        correctAnswer: 'An animal that eats only meat',
        isCorrect: true
      }
    ]
  },
  {
    id: 4,
    title: 'Marine Life',
    category: 'Oceans',
    difficulty: 'Medium',
    score: 6,
    totalQuestions: 10,
    date: '2023-12-30',
    duration: '5:20',
    status: 'completed',
    questions: [
      {
        question: 'Which is the largest species of shark?',
        userAnswer: 'Whale Shark',
        correctAnswer: 'Whale Shark',
        isCorrect: true
      },
      {
        question: 'How many arms does an octopus have?',
        userAnswer: '8',
        correctAnswer: '8',
        isCorrect: true
      },
      {
        question: 'What is the primary diet of blue whales?',
        userAnswer: 'Small fish',
        correctAnswer: 'Krill',
        isCorrect: false
      }
    ]
  },
  {
    id: 5,
    title: 'Jungle Explorers',
    category: 'Rainforests',
    difficulty: 'Hard',
    date: '2024-02-15',
    status: 'in-progress'
  }
];

export default function QuizHistory() {
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [filterOption, setFilterOption] = useState('all');

  const handleQuizClick = (quiz) => {
    setSelectedQuiz(quiz);
  };

  const closeQuizDetails = () => {
    setSelectedQuiz(null);
  };

  // Filter quizzes based on selected option
  const filteredQuizzes = quizzes.filter(quiz => {
    if (filterOption === 'all') return true;
    if (filterOption === 'in-progress') return quiz.status === 'in-progress';
    if (filterOption === 'completed') return quiz.status === 'completed';
    if (filterOption === 'high-score') return quiz.status === 'completed' && (quiz.score / quiz.totalQuestions) >= 0.8;
    return true;
  });

  // Calculate overall statistics
  const completedQuizzes = quizzes.filter(quiz => quiz.status === 'completed');
  const totalQuizzes = completedQuizzes.length;
  const totalQuestions = completedQuizzes.reduce((sum, quiz) => sum + quiz.totalQuestions, 0);
  const totalCorrect = completedQuizzes.reduce((sum, quiz) => sum + quiz.score, 0);
  const avgScore = totalQuizzes > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;

  // Get best category based on scores
  const categoryScores = {};
  completedQuizzes.forEach(quiz => {
    if (!categoryScores[quiz.category]) {
      categoryScores[quiz.category] = { total: 0, correct: 0 };
    }
    categoryScores[quiz.category].total += quiz.totalQuestions;
    categoryScores[quiz.category].correct += quiz.score;
  });

  let bestCategory = { name: 'N/A', score: 0 };
  for (const [category, scores] of Object.entries(categoryScores)) {
    const percentage = (scores.correct / scores.total) * 100;
    if (percentage > bestCategory.score) {
      bestCategory = { name: category, score: percentage };
    }
  }

  return (
    <div className={styles.quizContainer}>
      <header className={styles.quizHeader}>
        <h1>My Quiz History</h1>
        <p>Track your progress and review previous quizzes</p>
      </header>
      
      <div className={styles.statsCards}>
        <div className={styles.statsCard}>
          <div className={styles.statsIcon}>📊</div>
          <div className={styles.statsValue}>{avgScore}%</div>
          <div className={styles.statsLabel}>Average Score</div>
        </div>
        
        <div className={styles.statsCard}>
          <div className={styles.statsIcon}>🧠</div>
          <div className={styles.statsValue}>{totalQuizzes}</div>
          <div className={styles.statsLabel}>Quizzes Completed</div>
        </div>
        
        <div className={styles.statsCard}>
          <div className={styles.statsIcon}>⭐</div>
          <div className={styles.statsValue}>{bestCategory.name}</div>
          <div className={styles.statsLabel}>Best Category</div>
        </div>
        
        <div className={styles.statsCard}>
          <div className={styles.statsIcon}>🎯</div>
          <div className={styles.statsValue}>{totalCorrect}/{totalQuestions}</div>
          <div className={styles.statsLabel}>Questions Correct</div>
        </div>
      </div>

      <div className={styles.quizTools}>
        <div className={styles.filterButtons}>
          <button 
            className={`${styles.filterButton} ${filterOption === 'all' ? styles.active : ''}`}
            onClick={() => setFilterOption('all')}
          >
            All Quizzes
          </button>
          <button 
            className={`${styles.filterButton} ${filterOption === 'in-progress' ? styles.active : ''}`}
            onClick={() => setFilterOption('in-progress')}
          >
            In Progress
          </button>
          <button 
            className={`${styles.filterButton} ${filterOption === 'completed' ? styles.active : ''}`}
            onClick={() => setFilterOption('completed')}
          >
            Completed
          </button>
          <button 
            className={`${styles.filterButton} ${filterOption === 'high-score' ? styles.active : ''}`}
            onClick={() => setFilterOption('high-score')}
          >
            High Scores
          </button>
        </div>
        
        <button className={styles.newQuizButton}>
          <span>🎮</span> Start New Quiz
        </button>
      </div>

      <div className={styles.quizList}>
        {filteredQuizzes.length === 0 ? (
          <div className={styles.noResults}>
            <div className={styles.noResultsIcon}>📝</div>
            <h3>No quizzes found</h3>
            <p>Try a different filter or take a new quiz</p>
          </div>
        ) : (
          filteredQuizzes.map(quiz => (
            <div 
              key={quiz.id} 
              className={styles.quizCard}
              onClick={() => quiz.status === 'completed' && handleQuizClick(quiz)}
            >
              <div className={styles.quizMainInfo}>
                <h3 className={styles.quizTitle}>{quiz.title}</h3>
                <div className={styles.quizMeta}>
                  <span className={styles.quizCategory}>{quiz.category}</span>
                  <span className={styles.quizDifficulty} data-difficulty={quiz.difficulty.toLowerCase()}>
                    {quiz.difficulty}
                  </span>
                </div>
              </div>
              
              {quiz.status === 'completed' ? (
                <div className={styles.quizResults}>
                  <div className={styles.scoreDisplay}>
                    <div 
                      className={styles.scoreCircle} 
                      data-score-level={getScoreLevel(quiz.score / quiz.totalQuestions)}
                    >
                      <span>{quiz.score}/{quiz.totalQuestions}</span>
                    </div>
                  </div>
                  
                  <div className={styles.quizInfo}>
                    <div className={styles.quizDate}>
                      <span className={styles.infoIcon}>📅</span>
                      {new Date(quiz.date).toLocaleDateString()}
                    </div>
                    <div className={styles.quizDuration}>
                      <span className={styles.infoIcon}>⏱️</span>
                      {quiz.duration}
                    </div>
                  </div>
                </div>
              ) : (
                <div className={styles.inProgressIndicator}>
                  <span className={styles.pulsingDot}></span>
                  In Progress
                  <button className={styles.continueButton}>
                    Continue
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Quiz Detail Modal */}
      {selectedQuiz && (
        <div className={styles.modalOverlay} onClick={closeQuizDetails}>
          <div className={styles.quizModal} onClick={(e) => e.stopPropagation()}>
            <button className={styles.closeButton} onClick={closeQuizDetails}>×</button>
            
            <div className={styles.modalHeader}>
              <h2>{selectedQuiz.title}</h2>
              <div className={styles.quizSummary}>
                <span className={styles.quizCategory}>{selectedQuiz.category}</span>
                <span className={styles.quizDifficulty} data-difficulty={selectedQuiz.difficulty.toLowerCase()}>
                  {selectedQuiz.difficulty}
                </span>
                <span className={styles.quizDate}>
                  <span className={styles.infoIcon}>📅</span>
                  {new Date(selectedQuiz.date).toLocaleDateString()}
                </span>
              </div>
            </div>
            
            <div className={styles.modalResultSummary}>
              <div className={styles.resultCircle} data-score-level={getScoreLevel(selectedQuiz.score / selectedQuiz.totalQuestions)}>
                <div className={styles.scorePercentage}>
                  {Math.round((selectedQuiz.score / selectedQuiz.totalQuestions) * 100)}%
                </div>
                <div className={styles.scoreFraction}>
                  {selectedQuiz.score}/{selectedQuiz.totalQuestions}
                </div>
              </div>
              
              <div className={styles.resultFeedback}>
                {getFeedbackMessage(selectedQuiz.score / selectedQuiz.totalQuestions)}
              </div>
            </div>
            
            <div className={styles.questionsReview}>
              <h3>Questions Review</h3>
              
              <div className={styles.questionsList}>
                {selectedQuiz.questions.map((q, index) => (
                  <div 
                    key={index} 
                    className={`${styles.questionItem} ${q.isCorrect ? styles.correct : styles.incorrect}`}
                  >
                    <div className={styles.questionText}>
                      <span className={styles.questionNumber}>{index + 1}.</span>
                      {q.question}
                    </div>
                    
                    <div className={styles.answerSection}>
                      <div className={styles.userAnswer}>
                        <span className={styles.answerLabel}>Your answer:</span>
                        <span className={styles.answerText}>{q.userAnswer}</span>
                      </div>
                      
                      {!q.isCorrect && (
                        <div className={styles.correctAnswer}>
                          <span className={styles.answerLabel}>Correct answer:</span>
                          <span className={styles.answerText}>{q.correctAnswer}</span>
                        </div>
                      )}
                    </div>
                    
                    <div className={styles.answerIcon}>
                      {q.isCorrect ? '✅' : '❌'}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className={styles.modalActions}>
              <button className={styles.retakeButton}>
                <span>🔄</span> Retake Quiz
              </button>
              <button className={styles.shareResultButton}>
                <span>📤</span> Share Results
              </button>
            </div>
          </div>
        </div>
      )}
      
      <div className={styles.recommendedQuizzes}>
        <h3 className={styles.sectionTitle}>Recommended Quizzes</h3>
        <div className={styles.recommendedList}>
          <div className={styles.recommendedCard}>
            <div className={styles.recommendedIcon}>🦁</div>
            <h4>Big Cats of Africa</h4>
            <div className={styles.recommendedMeta}>
              <span>Wildlife</span> • <span>Medium</span>
            </div>
            <button className={styles.startButton}>Start Quiz</button>
          </div>
          
          <div className={styles.recommendedCard}>
            <div className={styles.recommendedIcon}>🦈</div>
            <h4>Ocean Predators</h4>
            <div className={styles.recommendedMeta}>
              <span>Marine</span> • <span>Hard</span>
            </div>
            <button className={styles.startButton}>Start Quiz</button>
          </div>
          
          <div className={styles.recommendedCard}>
            <div className={styles.recommendedIcon}>🦜</div>
            <h4>Colorful Birds</h4>
            <div className={styles.recommendedMeta}>
              <span>Birds</span> • <span>Easy</span>
            </div>
            <button className={styles.startButton}>Start Quiz</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper functions
function getScoreLevel(score) {
  if (score >= 0.9) return 'excellent';
  if (score >= 0.7) return 'good';
  if (score >= 0.5) return 'average';
  return 'needs-improvement';
}

function getFeedbackMessage(score) {
  if (score >= 0.9) return 'Excellent job! You\'re a true animal expert! 🎉';
  if (score >= 0.7) return 'Good work! You know your animals well! 👍';
  if (score >= 0.5) return 'Nice effort! Keep learning about animals! 📚';
  return 'Keep exploring! Try again to improve your score! 💪';
} 