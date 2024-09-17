import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import StepCounter from '../components/StepCounter';

const StepPage = () => {
  return (
    <View style={styles.container}>
      <StepCounter />
    </View>
  );
};

export default StepPage;

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
});