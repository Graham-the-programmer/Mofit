import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, AppState } from 'react-native';
import CircularProgress from 'react-native-circular-progress-indicator';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Pedometer } from 'expo-sensors';

const StepCounter = ({ onStepCountChange }) => {
  const [stepCount, setStepCount] = useState(0);
  const [appState, setAppState] = useState(AppState.currentState);
  const appStateSubscription = useRef(null);

  useEffect(() => {
    const init = async () => {
      // Check if steps were stored for today
      const today = new Date().toISOString().split('T')[0];
      const storedData = await AsyncStorage.getItem('stepData');
      let storedStepData = storedData ? JSON.parse(storedData) : {};

      if (storedStepData.date !== today) {
        // New day, reset steps
        storedStepData = { date: today, steps: 0 };
        await AsyncStorage.setItem('stepData', JSON.stringify(storedStepData));
      }

      setStepCount(storedStepData.steps);
    };

    init();

    const subscription = Pedometer.watchStepCount((result) => {
      setStepCount((prevStepCount) => prevStepCount + result.steps);
    });

    // Corrected AppState event listener
    appStateSubscription.current = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      subscription && subscription.remove();
      appStateSubscription.current && appStateSubscription.current.remove();
    };
  }, []);

  useEffect(() => {
    // Save step count to AsyncStorage whenever it changes
    const saveStepData = async () => {
      const today = new Date().toISOString().split('T')[0];
      const stepData = { date: today, steps: stepCount };
      await AsyncStorage.setItem('stepData', JSON.stringify(stepData));
    };

    saveStepData();

    // Notify parent component of the step count change
    onStepCountChange && onStepCountChange(stepCount);
  }, [stepCount]);

  const handleAppStateChange = async (nextAppState) => {
    if (appState.match(/inactive|background/) && nextAppState === 'active') {
      // App has come to the foreground, check if it's a new day
      const today = new Date().toISOString().split('T')[0];
      const storedData = await AsyncStorage.getItem('stepData');
      let storedStepData = storedData ? JSON.parse(storedData) : {};

      if (storedStepData.date !== today) {
        // New day, reset steps
        storedStepData = { date: today, steps: 0 };
        await AsyncStorage.setItem('stepData', JSON.stringify(storedStepData));
        setStepCount(0);
      }
    }
    setAppState(nextAppState);
  };

  return (
    <View style={styles.progressContainer}>
      <CircularProgress
        value={stepCount}
        maxValue={20000}
        radius={75}
        titleColor={'grey'}
        activeStrokeColor={'#97FB57'}
        inActiveStrokeColor={'grey'}
        inActiveStrokeOpacity={0.5}
        inActiveStrokeWidth={20}
        activeStrokeWidth={20}
        title={'Steps'}
        titleStyle={{ fontSize: 18 }}
        textColor={'grey'}
        textStyle={{ fontSize: 32 }}
      />
    </View>
  );
};

export default StepCounter;

const styles = StyleSheet.create({
  progressContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
