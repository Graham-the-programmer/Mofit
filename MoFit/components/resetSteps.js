const AsyncStorage = require('@react-native-async-storage/async-storage').default;

const resetSteps = async () => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const stepData = { date: today, steps: 0 };
    await AsyncStorage.setItem('stepData', JSON.stringify(stepData));
    console.log('Steps have been reset for today.');
  } catch (error) {
    console.error('Error resetting steps:', error);
  }
};

resetSteps();
