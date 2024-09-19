import { useState, useEffect } from 'react';
import { Pedometer } from 'expo-sensors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { doc, getDoc, setDoc } from 'firebase/firestore'; // Firebase Firestore functions
import { getAuth } from 'firebase/auth';
import { db } from '../pages/firebaseConfig'; // Import Firebase config

const useStepCounter = () => {
  const [stepCount, setStepCount] = useState(0); // For daily steps
  const [initialSteps, setInitialSteps] = useState(null); // Initial Pedometer reading
  const [loadingSteps, setLoadingSteps] = useState(true); // To avoid double saving while loading
  let subscription; // Declare subscription outside to access it in cleanup

  const auth = getAuth();
  const user = auth.currentUser;

  // Start pedometer tracking
  const startPedometer = () => {
    subscription = Pedometer.watchStepCount((result) => {
      if (initialSteps !== null) {
        const currentSteps = result.steps - initialSteps;
        if (currentSteps >= 0) {
          setStepCount(currentSteps);
          if (!loadingSteps) {
            saveStepsToFirebase(currentSteps); // Save to Firebase only if steps are loaded
          }
        }
      } else {
        setInitialSteps(result.steps); // Set initial steps if not set
      }
    });
  };

  // Save steps to Firebase for the logged-in user
  const saveStepsToFirebase = async (steps) => {
    if (!user) return;
    const today = new Date().toISOString().split('T')[0];
    try {
      const docRef = doc(db, 'steps', user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const existingData = docSnap.data();
        const updatedSteps = steps + (existingData[today] || 0); // Update steps for today
        await setDoc(docRef, { ...existingData, [today]: updatedSteps }, { merge: true });
      } else {
        await setDoc(docRef, { [today]: steps });
      }
    } catch (error) {
      console.error('Error saving steps to Firebase:', error);
    }
  };

  // Load the current day's steps from Firebase
  const loadStepsFromFirebase = async () => {
    if (!user) return;
    const today = new Date().toISOString().split('T')[0];
    try {
      const docRef = doc(db, 'steps', user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        const stepsToday = data[today] || 0;
        setStepCount(stepsToday);
      }
      setLoadingSteps(false); // Allow saving after steps are loaded
    } catch (error) {
      console.error('Error loading steps from Firebase:', error);
    }
  };

  // Load steps from Firebase on component mount
  useEffect(() => {
    if (user) {
      loadStepsFromFirebase();
      startPedometer(); // Start pedometer after loading steps
    }

    return () => {
      if (subscription) subscription.remove(); // Clean up pedometer subscription
    };
  }, [user]);

  return stepCount; // Return the step count directly as a number
};

export default useStepCounter;
