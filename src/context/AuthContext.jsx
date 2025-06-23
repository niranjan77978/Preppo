// contexts/AuthContext.js - Enhanced with optimistic progress management
import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  updateProfile 
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db, initializeUserProgress, getUserProgress, saveQuizProgress, saveTopicProgress } from '../firebase';

const AuthContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [userProgress, setUserProgress] = useState(null);

  async function signup(email, password, name) {
    try {
      // Create user account
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Update the user's display name
      await updateProfile(user, {
        displayName: name
      });

      // Initialize user data with progress tracking
      const basicUserData = {
        uid: user.uid,
        name: name,
        email: email,
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString(),
        profileComplete: true
      };
      
      const userDataWithProgress = await initializeUserProgress(user.uid, basicUserData);
      setUserData(userDataWithProgress);
      
      // Set initial progress state
      const progress = await getUserProgress(user.uid);
      setUserProgress(progress);
      
      return userCredential;
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  }

  async function login(email, password) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Update last login in Firestore
      const userDocRef = doc(db, 'users', user.uid);
      await setDoc(userDocRef, {
        lastLogin: new Date().toISOString()
      }, { merge: true });

      // Fetch user data from Firestore
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists()) {
        const userData = userDoc.data();
        setUserData(userData);
        
        // Load user progress
        const progress = await getUserProgress(user.uid);
        setUserProgress(progress);
      }

      return userCredential;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  async function logout() {
    try {
      await signOut(auth);
      setUserData(null);
      setUserProgress(null);
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  }

  // Function to save quiz progress and update local state
  async function updateQuizProgress(quizId, progressData) {
    if (!currentUser) return;
    
    try {
      await saveQuizProgress(currentUser.uid, quizId, progressData);
      
      // Refresh user progress
      const updatedProgress = await getUserProgress(currentUser.uid);
      setUserProgress(updatedProgress);
      
      return { success: true };
    } catch (error) {
      console.error('Error updating quiz progress:', error);
      throw error;
    }
  }

  // Function to save topic progress with optimistic updates for instant UI response
  async function updateTopicProgress(subject, topic, isCompleted) {
    if (!currentUser) return;
    
    // Store the previous state for potential rollback
    const previousState = userProgress ? { ...userProgress } : null;
    
    try {
      // OPTIMISTIC UPDATE: Update local state immediately for instant UI response
      setUserProgress(prevProgress => {
        const updatedProgress = { ...prevProgress };
        if (!updatedProgress.completedTopics) {
          updatedProgress.completedTopics = {};
        }
        if (!updatedProgress.completedTopics[subject]) {
          updatedProgress.completedTopics[subject] = [];
        }
        
        if (isCompleted) {
          if (!updatedProgress.completedTopics[subject].includes(topic)) {
            updatedProgress.completedTopics[subject] = [...updatedProgress.completedTopics[subject], topic];
            updatedProgress.totalTopicsCompleted = (updatedProgress.totalTopicsCompleted || 0) + 1;
          }
        } else {
          updatedProgress.completedTopics[subject] = updatedProgress.completedTopics[subject].filter(t => t !== topic);
          updatedProgress.totalTopicsCompleted = Math.max(0, (updatedProgress.totalTopicsCompleted || 0) - 1);
        }
        
        return updatedProgress;
      });
      
      // Now make the Firebase call in the background
      await saveTopicProgress(currentUser.uid, subject, topic, isCompleted);
      
      return { success: true };
    } catch (error) {
      console.error('Error updating topic progress:', error);
      
      // ROLLBACK: If Firebase operation fails, revert to previous state
      if (previousState) {
        setUserProgress(previousState);
      }
      
      throw error;
    }
  }

  // Function to check if a topic is completed
  function isTopicCompleted(subject, topic) {
    if (!userProgress || !userProgress.completedTopics[subject]) {
      return false;
    }
    return userProgress.completedTopics[subject].includes(topic);
  }

  // Function to get quiz progress for a specific quiz
  function getQuizProgress(quizId) {
    if (!userProgress || !userProgress.quizProgress[quizId]) {
      return null;
    }
    return userProgress.quizProgress[quizId];
  }

  // Function to check if a quiz is completed
  function isQuizCompleted(quizId) {
    return userProgress?.completedQuizzes?.includes(quizId) || false;
  }

  // Load user data from Firestore when auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const userDocRef = doc(db, 'users', user.uid);
          const userDoc = await getDoc(userDocRef);
          
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setUserData(userData);
            
            // Load user progress
            const progress = await getUserProgress(user.uid);
            setUserProgress(progress);
          } else {
            // If no document exists, create one with basic info and progress structure
            const basicUserData = {
              uid: user.uid,
              name: user.displayName || 'User',
              email: user.email,
              createdAt: new Date().toISOString(),
              lastLogin: new Date().toISOString(),
              profileComplete: false
            };
            
            const userDataWithProgress = await initializeUserProgress(user.uid, basicUserData);
            setUserData(userDataWithProgress);
            
            const progress = await getUserProgress(user.uid);
            setUserProgress(progress);
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      } else {
        setUserData(null);
        setUserProgress(null);
      }
      
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    userData,
    userProgress,
    signup,
    login,
    logout,
    loading,
    updateQuizProgress,
    updateTopicProgress,
    isTopicCompleted,
    getQuizProgress,
    isQuizCompleted
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}