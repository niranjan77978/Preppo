import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc, updateDoc, arrayUnion, arrayRemove, increment } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC06Uu93dd3xpRt10F9_wk13wojfE4QjGM",
  authDomain: "preppoo.firebaseapp.com",
  projectId: "preppoo",
  storageBucket: "preppoo.firebasestorage.app",
  messagingSenderId: "660152996842",
  appId: "1:660152996842:web:4347f10bd884cfe176d893",
  measurementId: "G-YTDJV1EHQQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

// User Progress Management Functions

/**
 * Save quiz progress to user's document
 * @param {string} userId - User's UID
 * @param {string} quizId - Quiz identifier (e.g., "networks-quiz1")
 * @param {Object} progressData - Quiz progress data
 */
export async function saveQuizProgress(userId, quizId, progressData) {
  try {
    const userDocRef = doc(db, 'users', userId);
    
    // Get current user data
    const userDoc = await getDoc(userDocRef);
    const userData = userDoc.exists() ? userDoc.data() : {};
    
    // Initialize progress structures if they don't exist
    const quizProgress = userData.quizProgress || {};
    const completedQuizzes = userData.completedQuizzes || [];
    
    // Update quiz progress
    quizProgress[quizId] = {
      ...progressData,
      completedAt: new Date().toISOString(),
      attempts: (quizProgress[quizId]?.attempts || 0) + 1,
      bestScore: Math.max(progressData.score, quizProgress[quizId]?.bestScore || 0)
    };
    
    // Add to completed quizzes if not already present
    const isAlreadyCompleted = completedQuizzes.includes(quizId);
    
    const updateData = {
      quizProgress,
      lastActivity: new Date().toISOString()
    };
    
    if (!isAlreadyCompleted) {
      updateData.completedQuizzes = arrayUnion(quizId);
      updateData.totalQuizzesCompleted = increment(1);
    }
    
    // Update total score and accuracy
    const totalScore = (userData.totalScore || 0) + progressData.score;
    const totalQuestions = (userData.totalQuestions || 0) + progressData.total;
    
    updateData.totalScore = totalScore;
    updateData.totalQuestions = totalQuestions;
    updateData.overallAccuracy = Math.round((totalScore / totalQuestions) * 100);
    
    await updateDoc(userDocRef, updateData);
    
    console.log('Quiz progress saved successfully');
    return { success: true };
  } catch (error) {
    console.error('Error saving quiz progress:', error);
    throw error;
  }
}

/**
 * OPTIMIZED: Save completed topic to user's document with minimal operations
 * @param {string} userId - User's UID
 * @param {string} subject - Subject name (e.g., "networks", "os")
 * @param {string} topic - Topic name
 * @param {boolean} isCompleted - Whether topic is completed or not
 */
export async function saveTopicProgress(userId, subject, topic, isCompleted) {
  try {
    const userDocRef = doc(db, 'users', userId);
    
    // Build the update data efficiently without reading the document first
    const updateData = {
      lastActivity: new Date().toISOString()
    };
    
    if (isCompleted) {
      // Add topic to completed list and increment counter
      updateData[`completedTopics.${subject}`] = arrayUnion(topic);
      updateData.totalTopicsCompleted = increment(1);
    } else {
      // Remove topic from completed list and decrement counter
      updateData[`completedTopics.${subject}`] = arrayRemove(topic);
      updateData.totalTopicsCompleted = increment(-1);
    }
    
    // Single atomic update operation
    await updateDoc(userDocRef, updateData);
    
    console.log('Topic progress saved successfully');
    return { success: true };
  } catch (error) {
    console.error('Error saving topic progress:', error);
    throw error;
  }
}

/**
 * BATCH OPTIMIZED: Save multiple topics progress in a single operation
 * @param {string} userId - User's UID
 * @param {Array} topicUpdates - Array of {subject, topic, isCompleted}
 */
export async function saveMultipleTopicsProgress(userId, topicUpdates) {
  try {
    const userDocRef = doc(db, 'users', userId);
    
    const updateData = {
      lastActivity: new Date().toISOString()
    };
    
    let totalIncrement = 0;
    
    topicUpdates.forEach(({ subject, topic, isCompleted }) => {
      if (isCompleted) {
        updateData[`completedTopics.${subject}`] = arrayUnion(topic);
        totalIncrement += 1;
      } else {
        updateData[`completedTopics.${subject}`] = arrayRemove(topic);
        totalIncrement -= 1;
      }
    });
    
    if (totalIncrement !== 0) {
      updateData.totalTopicsCompleted = increment(totalIncrement);
    }
    
    await updateDoc(userDocRef, updateData);
    
    console.log('Multiple topics progress saved successfully');
    return { success: true };
  } catch (error) {
    console.error('Error saving multiple topics progress:', error);
    throw error;
  }
}

/**
 * Get user's complete progress data
 * @param {string} userId - User's UID
 */
export async function getUserProgress(userId) {
  try {
    const userDocRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userDocRef);
    
    if (userDoc.exists()) {
      const userData = userDoc.data();
      return {
        quizProgress: userData.quizProgress || {},
        completedQuizzes: userData.completedQuizzes || [],
        completedTopics: userData.completedTopics || {},
        totalQuizzesCompleted: userData.totalQuizzesCompleted || 0,
        totalTopicsCompleted: userData.totalTopicsCompleted || 0,
        totalScore: userData.totalScore || 0,
        totalQuestions: userData.totalQuestions || 0,
        overallAccuracy: userData.overallAccuracy || 0,
        lastActivity: userData.lastActivity
      };
    } else {
      return {
        quizProgress: {},
        completedQuizzes: [],
        completedTopics: {},
        totalQuizzesCompleted: 0,
        totalTopicsCompleted: 0,
        totalScore: 0,
        totalQuestions: 0,
        overallAccuracy: 0,
        lastActivity: null
      };
    }
  } catch (error) {
    console.error('Error getting user progress:', error);
    throw error;
  }
}

/**
 * CACHED: Get user progress with optional caching for better performance
 * @param {string} userId - User's UID
 * @param {boolean} useCache - Whether to use cached data if available
 */
let progressCache = new Map();
let cacheTimestamp = new Map();
const CACHE_DURATION = 30000; // 30 seconds

export async function getUserProgressCached(userId, useCache = true) {
  try {
    const now = Date.now();
    const cached = progressCache.get(userId);
    const timestamp = cacheTimestamp.get(userId);
    
    // Return cached data if it's fresh and cache is enabled
    if (useCache && cached && timestamp && (now - timestamp) < CACHE_DURATION) {
      return cached;
    }
    
    // Fetch fresh data
    const progress = await getUserProgress(userId);
    
    // Update cache
    progressCache.set(userId, progress);
    cacheTimestamp.set(userId, now);
    
    return progress;
  } catch (error) {
    console.error('Error getting cached user progress:', error);
    throw error;
  }
}

/**
 * Clear progress cache for a user (call after updates)
 * @param {string} userId - User's UID
 */
export function clearProgressCache(userId) {
  progressCache.delete(userId);
  cacheTimestamp.delete(userId);
}

/**
 * Get quiz statistics for a specific subject
 * @param {string} userId - User's UID
 * @param {string} subject - Subject name
 */
export async function getSubjectQuizStats(userId, subject) {
  try {
    const userProgress = await getUserProgressCached(userId);
    const quizProgress = userProgress.quizProgress;
    
    // Filter quizzes for the specific subject
    const subjectQuizzes = Object.keys(quizProgress).filter(quizId => 
      quizId.startsWith(subject)
    );
    
    let totalScore = 0;
    let totalQuestions = 0;
    let completedCount = subjectQuizzes.length;
    
    subjectQuizzes.forEach(quizId => {
      const quiz = quizProgress[quizId];
      totalScore += quiz.bestScore || quiz.score || 0;
      totalQuestions += quiz.total || 0;
    });
    
    return {
      completedQuizzes: completedCount,
      totalScore,
      totalQuestions,
      accuracy: totalQuestions > 0 ? Math.round((totalScore / totalQuestions) * 100) : 0,
      completedTopics: userProgress.completedTopics[subject]?.length || 0
    };
  } catch (error) {
    console.error('Error getting subject quiz stats:', error);
    throw error;
  }
}

/**
 * Initialize user document with default progress structure
 * @param {string} userId - User's UID
 * @param {Object} basicUserData - Basic user data
 */
export async function initializeUserProgress(userId, basicUserData) {
  try {
    const userDocRef = doc(db, 'users', userId);
    
    const userDataWithProgress = {
      ...basicUserData,
      quizProgress: {},
      completedQuizzes: [],
      completedTopics: {
        networks: [],
        os: [],
        dbms: [],
        ds: [],
        oops: [],
        'web-dev': []
      },
      totalQuizzesCompleted: 0,
      totalTopicsCompleted: 0,
      totalScore: 0,
      totalQuestions: 0,
      overallAccuracy: 0,
      lastActivity: new Date().toISOString()
    };
    
    await setDoc(userDocRef, userDataWithProgress);
    console.log('User progress initialized successfully');
    return userDataWithProgress;
  } catch (error) {
    console.error('Error initializing user progress:', error);
    throw error;
  }
}

export default app;