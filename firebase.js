import { getFirestore, doc, setDoc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const db = getFirestore();
const auth = getAuth();

// Save user's quiz progress (merges with existing progress)
export async function saveQuizProgress(userId, quizId, progressData) {
  const userRef = doc(db, "users", userId);
  await setDoc(userRef, {
    quizProgress: {
      [quizId]: progressData
    }
  }, { merge: true });
}

// Get user's quiz progress
export async function getQuizProgress(userId, quizId) {
  const userRef = doc(db, "users", userId);
  const userSnap = await getDoc(userRef);
  if (userSnap.exists()) {
    const data = userSnap.data();
    return data.quizProgress ? data.quizProgress[quizId] : null;
  }
  return null;
}

// Mark a topic as studied
export async function markTopicStudied(userId, topicId) {
  const userRef = doc(db, "users", userId);
  await updateDoc(userRef, {
    studiedTopics: arrayUnion(topicId)
  });
}

// Get studied topics
export async function getStudiedTopics(userId) {
  const userRef = doc(db, "users", userId);
  const userSnap = await getDoc(userRef);
  if (userSnap.exists()) {
    const data = userSnap.data();
    return data.studiedTopics || [];
  }
  return [];
}