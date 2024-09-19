import React, { useState, useEffect } from 'react';
import { View, StyleSheet, DeviceEventEmitter } from 'react-native';
import CircularProgress from 'react-native-circular-progress-indicator';
import AsyncStorage from '@react-native-async-storage/async-storage';

const DashboardStepCounter = () => {
  const [stepCount, setStepCount] = useState(0);
  // get step data from storage 
  const getStepsFromStorage = async () => {
    const storedData = await AsyncStorage.getItem('stepData');
    if (storedData !== null) {
      const stepData = JSON.parse(storedData);
      setStepCount(stepData.steps || 0);
    }
  };

  useEffect(() => {
    
    getStepsFromStorage();

   
    const subscription = DeviceEventEmitter.addListener('stepCountChanged', (newStepCount) => {
      setStepCount(newStepCount);
    });

    return () => {
      
      subscription.remove();
    };
  }, []);

  return (
    // desktop step display
    <View style={styles.progressContainer}>
      <CircularProgress
        value={stepCount}
        maxValue={20000}
        radius={50} 
        titleColor={'grey'}
        activeStrokeColor={'#97FB57'}
        inActiveStrokeColor={'grey'}
        inActiveStrokeOpacity={0.5}
        inActiveStrokeWidth={10}
        activeStrokeWidth={10}
        title={'Steps'}
        titleStyle={{ fontSize: 14 }}
        textColor={'grey'}
        textStyle={{ fontSize: 24 }}
      />
    </View>
  );
};

export default DashboardStepCounter;

const styles = StyleSheet.create({
  progressContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});
