import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import CircularProgress from 'react-native-circular-progress-indicator';
import { Pedometer } from 'expo-sensors';

const StepCounter = () => {
  const [stepCount, updateStepCount] = useState(0);

  useEffect(() => {
    const startPedometer = () => {
      const subscription = Pedometer.watchStepCount((result) => {
        updateStepCount(result.steps);
      });
      return subscription;
    };

    const subscription = startPedometer();

    return () => {
      if (subscription) subscription.remove();
    };
  }, []);

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
