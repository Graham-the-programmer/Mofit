import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, PermissionsAndroid, Alert } from 'react-native';
import { Pedometer } from 'expo-sensors';
import CircularProgress from 'react-native-circular-progress-indicator';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage
import { doc, getDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { db } from '../pages/firebaseConfig'; 

const StepCounter = () => {
  const [stepCount, updateStepCount] = useState(0);
  const [weeklySteps, setWeeklySteps] = useState({});
  const [permissionGranted, setPermissionGranted] = useState(false); 

  const auth = getAuth();
  const user = auth.currentUser;

  const Dist = stepCount / 1300;
  const DistanceCovered = Dist ? Dist.toFixed(3) : '0.000';
  const cal = DistanceCovered * 60;
  const caloriesBurned = cal ? cal.toFixed(3) : '0.000';

  // Save steps to local storage
  const saveStepsToLocalStorage = async (newStepCount) => {
    const today = new Date().toISOString().split('T')[0]; // Get current date
    try {
      await AsyncStorage.setItem(`steps-${user.uid}-${today}`, JSON.stringify(newStepCount));
    } catch (error) {
      console.error('Failed to save steps to local storage:', error);
    }
  };

  // Retrieve steps from local storage
  const getStepsFromLocalStorage = async () => {
    const today = new Date().toISOString().split('T')[0];
    try {
      const storedSteps = await AsyncStorage.getItem(`steps-${user.uid}-${today}`);
      return storedSteps != null ? JSON.parse(storedSteps) : 0; // Default to 0 if no steps are found
    } catch (error) {
      console.error('Failed to retrieve steps from local storage:', error);
      return 0;
    }
  };

  // Request permission for activity recognition (Android)
  const requestActivityPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACTIVITY_RECOGNITION
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        setPermissionGranted(true);
        startPedometer();
      } else {
        Alert.alert('Permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const startPedometer = () => {
    const subscription = Pedometer.watchStepCount(async (result) => {
      updateStepCount(result.steps);
      saveStepsToLocalStorage(result.steps); // Save steps to local storage whenever updated
    });
    return subscription;
  };

  // Retrieve the weekly steps from Firebase (or other method)
  const getWeeklySteps = async () => {
    if (!user) return;
    const docRef = doc(db, 'steps', user.uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      let weeklyStepsData = {};

      const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

      for (let i = 0; i < 7; i++) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const day = date.toISOString().split('T')[0];
        const dayOfWeek = daysOfWeek[(date.getDay() + 6) % 7];  
        weeklyStepsData[dayOfWeek] = data[day] || 0;
      }

      setWeeklySteps(weeklyStepsData);  
    }
  };

  useEffect(() => {
    let subscription;
    
    const initializeSteps = async () => {
      const storedSteps = await getStepsFromLocalStorage(); // Retrieve steps from storage on app start
      updateStepCount(storedSteps); // Initialize step count
      if (!permissionGranted) {
        requestActivityPermission();
      } else {
        subscription = startPedometer();
        getWeeklySteps();
      }
    };

    initializeSteps();

    return () => {
      if (subscription) subscription.remove();
    };
  }, [permissionGranted]);

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.progressContainer}>
        <CircularProgress
          value={stepCount}
          maxValue={8000}
          radius={120}
          titleColor={'grey'}
          activeStrokeColor={'green'}
          inActiveStrokeColor={'red'}
          inActiveStrokeOpacity={0.5}
          inActiveStrokeWidth={20}
          activeStrokeWidth={20}
          title={'Steps'}
          titleStyle={{ fontSize: 18 }}
          textColor={'grey'}
          textStyle={{ fontSize: 32 }}
        />
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>Target: 8000 steps (6.4km)</Text>
        <Text style={styles.infoText}>Distance Covered: {DistanceCovered} km</Text>
        <Text style={styles.infoText}>Calories Burned: {caloriesBurned} kcal</Text>
      </View>

      <View style={styles.weeklyStepsContainer}>
        <View style={styles.weekdaysContainer}>
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map((day) => (
            <View key={day} style={styles.dayContainer}>
              <CircularProgress
                value={weeklySteps[day] || 0}
                maxValue={8000}
                radius={33}
                titleColor={'grey'}
                activeStrokeColor={'blue'}
                inActiveStrokeColor={'gray'}
                inActiveStrokeOpacity={0.5}
                inActiveStrokeWidth={10}
                activeStrokeWidth={10}
                title={day}
                titleStyle={{ fontSize: 10 }}
                textColor={'grey'}
                textStyle={{ fontSize: 12 }}
              />
            </View>
          ))}
        </View>
        <View style={styles.weekendContainer}>
          {['Sat', 'Sun'].map((day) => (
            <View key={day} style={styles.dayContainer}>
              <CircularProgress
                value={weeklySteps[day] || 0}
                maxValue={8000}
                radius={33}
                titleColor={'grey'}
                activeStrokeColor={'blue'}
                inActiveStrokeColor={'gray'}
                inActiveStrokeOpacity={0.5}
                inActiveStrokeWidth={10}
                activeStrokeWidth={10}
                title={day}
                titleStyle={{ fontSize: 10 }}
                textColor={'grey'}
                textStyle={{ fontSize: 12 }}
              />
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

export default StepCounter;

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  progressContainer: {
    justifyContent: 'center', 
    alignItems: 'center', 
    marginBottom: 20,
  },
  infoContainer: {
    alignItems: 'center', 
    marginBottom: 20,
  },
  infoText: {
    fontSize: 16,
    color: '#333',
    marginVertical: 5,
  },
  weeklyStepsContainer: {
    marginTop: 30,
    width: '100%',
  },
  weekdaysContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  weekendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  dayContainer: {
    alignItems: 'center',
    marginHorizontal: 5,
  },
});
