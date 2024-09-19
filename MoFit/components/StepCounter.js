import React, { useState, useEffect, useRef } from 'react';
import { Text, View, StyleSheet, AppState, DeviceEventEmitter } from 'react-native';
import CircularProgress from 'react-native-circular-progress-indicator';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Pedometer } from 'expo-sensors';
import appStyles from './Styles';

const StepCounter = () => {
  const [stepCount, setStepCount] = useState(0);
  const appState = useRef(AppState.currentState);

  // reset step count to 0
  const resetStepsIfNeeded = async () => {
    const today = new Date().toISOString().split('T')[0];
    const storedData = await AsyncStorage.getItem('stepData');
    let storedStepData = storedData ? JSON.parse(storedData) : {};

    // checks todays date to see if new day to reset
    if (storedStepData.date !== today) {
      storedStepData = { date: today, steps: 0 };
      await AsyncStorage.setItem('stepData', JSON.stringify(storedStepData));
      setStepCount(0);
      
      // creates event that steps have been changed
      DeviceEventEmitter.emit('stepCountChanged', 0);
      console.log('Steps have been reset for today.');
    } else {
      setStepCount(storedStepData.steps || 0);
    }
  };

  useEffect(() => {
    
    const init = async () => {
      await resetStepsIfNeeded();
    };

    init();

    // watches pedometer for steps, handles state changes
    const subscription = Pedometer.watchStepCount((result) => {
      setStepCount((prevStepCount) => prevStepCount + result.steps);
    });

    
    const appStateSubscription = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      subscription && subscription.remove();
      appStateSubscription && appStateSubscription.remove();
    };
  }, []);

//  saves current steps and date in asyncstorage
  useEffect(() => {
    const saveStepData = async () => {
      const today = new Date().toISOString().split('T')[0];
      const stepData = { date: today, steps: stepCount };
      await AsyncStorage.setItem('stepData', JSON.stringify(stepData));

      
      DeviceEventEmitter.emit('stepCountChanged', stepCount);
    };

    saveStepData();
  }, [stepCount]);

  // checks if app is active and if steps should be reset
  const handleAppStateChange = async (nextAppState) => {
    if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
      await resetStepsIfNeeded();
    }
    appState.current = nextAppState;
  };

  return (
    // main step counter display
    <View style={styles.progressContainer}>
      <CircularProgress
        value={stepCount}
        maxValue={20000}
        radius={100}
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

      <Text style={appStyles.text}>
        Distance Walked: {((stepCount * 0.76) / 1000).toFixed(2)} km
      </Text>
      <Text style={appStyles.text}>
        Calories Burned: {(stepCount * 0.04).toFixed(2)} 
      </Text>
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
