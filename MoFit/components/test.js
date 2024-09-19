import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import useStepCounter from './StepLogic'; // Import the step counter logic

const StepCounter = () => {
  const { stepCount } = useStepCounter(); // Get step count from the hook

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Today's Steps</Text>
      <Text style={styles.steps}>{stepCount}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  steps: {
    fontSize: 48,
    color: 'green',
  },
});

export default StepCounter;