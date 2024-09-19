import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Easing } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// challenge library --- add some more later
const challenges = [
  'Do 20 push-ups',
  'Run for 15 minutes',
  'Take 10,000 steps',
  'Do 30 squats',
  'Meditate for 10 minutes',
  'Drink 8 glasses of water',
  'Stretch for 15 minutes',
];
// main card/ challenge consts 
const DailyChallengeCard = () => {
  const [dailyChallenge, setDailyChallenge] = useState('');
  const [isCompleted, setIsCompleted] = useState(false);
  const [animation] = useState(new Animated.Value(0));

  // retrive daily challeng or random challenge if problem / store in async storage
  useEffect(() => {
    const getDailyChallenge = async () => {
      const today = new Date().toISOString().split('T')[0];
      const storedData = await AsyncStorage.getItem('dailyChallenge');
      let challengeData = storedData ? JSON.parse(storedData) : {};

      if (challengeData.date !== today) {
        const randomChallenge = challenges[Math.floor(Math.random() * challenges.length)];
        challengeData = { date: today, challenge: randomChallenge, completed: false };
        await AsyncStorage.setItem('dailyChallenge', JSON.stringify(challengeData));
      }

      setDailyChallenge(challengeData.challenge);
      setIsCompleted(challengeData.completed);
    };

    getDailyChallenge();
  }, []);
    // handle if challenge complete 
  const handleComplete = async () => {
    setIsCompleted(true);

    const today = new Date().toISOString().split('T')[0];
    const challengeData = { date: today, challenge: dailyChallenge, completed: true };
    await AsyncStorage.setItem('dailyChallenge', JSON.stringify(challengeData));

    //  animation
    Animated.timing(animation, {
      toValue: 1,
      duration: 800,
      easing: Easing.bounce,
      useNativeDriver: true,
    }).start();
  };

  const animatedScale = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0.1, 1],
  });

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Today's Challenge</Text>
      <Text style={styles.challengeText}>{dailyChallenge}</Text>

      {isCompleted ? (
        <Animated.View style={[styles.checkmarkContainer, { transform: [{ scale: animatedScale }] }]}>
          <Text style={styles.checkmark}>✔️</Text>
        </Animated.View>
      ) : (
        <TouchableOpacity style={styles.button} onPress={handleComplete}>
          <Text style={styles.buttonText}>Complete</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default DailyChallengeCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#232323',
    padding: 20,
    borderRadius: 10,
    width: 250,
    alignItems: 'center',
    marginVertical: 10,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  title: {
    fontSize: 20,
    color: '#97FB57',
    marginBottom: 10,
  },
  challengeText: {
    fontSize: 18,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#97FB57',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    alignItems: 'center', 
  },
  buttonText: {
    color: '#121212',
    fontSize: 16,
    fontWeight: 'bold',
  },
  checkmarkContainer: {
    position: 'absolute', 
    top: '40%', 
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmark: {
    fontSize: 100, 
    color: '#97FB57',
  },
});
