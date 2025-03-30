'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import styles from '../components/Components.module.css';

export default function QuizHistory() {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [quizzes, setQuizzes] = useState([]);
  const [filter, setFilter] = useState('all');
  
  // Sample quiz data - in a real app, this would come from your database
  const sampleQuizzes = [
    {
      id: 1,
      title: 'Animal Habitats',
      category: 'Environment',
      date: '2024-03-15',
      score: 9,
      totalQuestions: 10,
      timeSpent: '4:35',
      difficulty: 'medium',
      completed: true
    },
    {
      id: 2,
      title: 'Animal Facts Challenge',
      category: 'Knowledge',
      date: '2024-03-10',
      score: 8,
      totalQuestions: 10,
      timeSpent: '5:20',
      difficulty: 'hard',
      completed: true
    },
    {
      id: 3,
      title: 'Endangered Species',
      category: 'Conservation',
      date: '2024-03-05',
      score: 7,
      totalQuestions: 10,
      timeSpent: '3:45',
      difficulty: 'medium',
      completed: true
    },
    {
      id: 4,
      title: 'Animal Sounds Quiz',
      category: 'Fun',
      date: '2024-02-28',
      score: 10,
      totalQuestions: 10,
      timeSpent: '2:50',
      difficulty: 'easy',
      completed: true
    },
    {
      id: 5,
      title: 'Safari Adventure',
      category: 'Adventure',
      date: '2024-02-20',
      score: 6,
      totalQuestions: 10,
      timeSpent: '6:15',
      difficulty: 'hard',
      completed: true
    },
    {
      id: 6,
      title: 'Marine Life',
      category: 'Ocean',
      date: null,
      score: null,
      totalQuestions: 10,
      timeSpent: '1:30',
      difficulty: 'medium',
      completed: false
    }
  ];
  
  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    
    // Simulate loading quiz history
    setTimeout(() => {
      setQuizzes(sampleQuizzes);
      setLoading(false);
    }, 1000);
  }, [user, router]);
  
  const getScoreLevel = (score, total) => {
    const percentage = (score / total) * 100;
    if (percentage >= 90) return 'excellent';
    if (percentage >= 75) return 'good';
    if (percentage >= 60) return 'average';
    return 'needs-improvement';
  };
  
  const getFilteredQuizzes = () => {
    if (filter === 'all') return quizzes;
    if (filter === 'completed') return quizzes.filter(quiz => quiz.completed);
    if (filter === 'in-progress') return quizzes.filter(quiz => !quiz.completed);
    return quizzes;
  };
  
  const getOverallStats = () => {
    const completedQuizzes = quizzes.filter(quiz => quiz.completed);
    
    if (completedQuizzes.length === 0) {
      return {
        totalQuizzes: 0,
        averageScore: 0,
        bestScore: 0,
        totalTime: '0:00'
      };
    }
    
    const totalScore = completedQuizzes.reduce((sum, quiz) => sum + quiz.score, 0);
    const totalQuestions = completedQuizzes.reduce((sum, quiz) => sum + quiz.totalQuestions, 0);
    const bestScore = Math.max(...completedQuizzes.map(quiz => quiz.score / quiz.totalQuestions * 100));
    
    // Calculate total time (simple implementation - assumes format is "M:SS")
    let totalMinutes = 0;
    completedQuizzes.forEach(quiz => {
      const [mins, secs] = quiz.timeSpent.split(':').map(Number);
      totalMinutes += mins + (secs / 60);
    });
    
    const hours = Math.floor(totalMinutes / 60);
    const minutes = Math.floor(totalMinutes % 60);
    const totalTime = hours > 0 
      ? `${hours}h ${minutes}m` 
      : `${minutes}m`;
    
    return {
      totalQuizzes: completedQuizzes.length,
      averageScore: Math.round((totalScore / totalQuestions) * 100),
      bestScore: Math.round(bestScore),
      totalTime
    };
  };
  
  const stats = getOverallStats();
  
  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
        <p>Loading your quiz history...</p>
      </div>
    );
  }
  
  return (
    <div className={styles.quizContainer}>
      <header className={styles.quizHeader}>
        <h1>Your Quiz History</h1>
        <p>Review your performance and track your progress</p>
      </header>
      
      <div className={styles.statsCards}>
        <div className={styles.statsCard}>
          <div className={styles.statsIcon}>📝</div>
          <div className={styles.statsValue}>{stats.totalQuizzes}</div>
          <div className={styles.statsLabel}>Quizzes Taken</div>
        </div>
        
        <div className={styles.statsCard}>
          <div className={styles.statsIcon}>🏆</div>
          <div className={styles.statsValue}>{stats.averageScore}%</div>
          <div className={styles.statsLabel}>Average Score</div>
        </div>
        
        <div className={styles.statsCard}>
          <div className={styles.statsIcon}>⭐</div>
          <div className={styles.statsValue}>{stats.bestScore}%</div>
          <div className={styles.statsLabel}>Best Score</div>
        </div>
        
        <div className={styles.statsCard}>
          <div className={styles.statsIcon}>⏱️</div>
          <div className={styles.statsValue}>{stats.totalTime}</div>
          <div className={styles.statsLabel}>Total Time</div>
        </div>
      </div>
      
      <div className={styles.quizTools}>
        <div className={styles.filterButtons}>
          <button 
            className={`${styles.filterButton} ${filter === 'all' ? styles.active : ''}`}
            onClick={() => setFilter('all')}
          >
            All Quizzes
          </button>
          <button 
            className={`${styles.filterButton} ${filter === 'completed' ? styles.active : ''}`}
            onClick={() => setFilter('completed')}
          >
            Completed
          </button>
          <button 
            className={`${styles.filterButton} ${filter === 'in-progress' ? styles.active : ''}`}
            onClick={() => setFilter('in-progress')}
          >
            In Progress
          </button>
        </div>
        
        <button className={styles.newQuizButton} onClick={() => router.push('/quiz')}>
          Take New Quiz
        </button>
      </div>
      
      <div className={styles.quizList}>
        {getFilteredQuizzes().length === 0 ? (
          <div className={styles.noResults}>
            <div className={styles.noResultsIcon}>📋</div>
            <h3>No quizzes found</h3>
            <p>Try a different filter or take a new quiz</p>
          </div>
        ) : (
          getFilteredQuizzes().map(quiz => (
            <div key={quiz.id} className={styles.quizCard}>
              <div className={styles.quizMainInfo}>
                <h3 className={styles.quizTitle}>{quiz.title}</h3>
                <div className={styles.quizMeta}>
                  <span className={styles.quizCategory}>{quiz.category}</span>
                  <span 
                    className={styles.quizDifficulty}
                    data-difficulty={quiz.difficulty}
                  >
                    {quiz.difficulty.charAt(0).toUpperCase() + quiz.difficulty.slice(1)}
                  </span>
                </div>
              </div>
              
              {quiz.completed ? (
                <div className={styles.quizResults}>
                  <div 
                    className={styles.scoreCircle}
                    data-score-level={getScoreLevel(quiz.score, quiz.totalQuestions)}
                  >
                    {quiz.score}/{quiz.totalQuestions}
                  </div>
                  <div className={styles.quizInfo}>
                    <div className={styles.quizDate}>
                      <span className={styles.infoIcon}>📅</span>
                      {new Date(quiz.date).toLocaleDateString()}
                    </div>
                    <div className={styles.quizDuration}>
                      <span className={styles.infoIcon}>⏱️</span>
                      {quiz.timeSpent}
                    </div>
                  </div>
                </div>
              ) : (
                <div className={styles.inProgressIndicator}>
                  <div className={styles.pulsingDot}></div>
                  <span>In Progress</span>
                  <button 
                    className={styles.continueButton}
                    onClick={() => router.push(`/quiz/${quiz.id}`)}
                  >
                    Continue
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
} 