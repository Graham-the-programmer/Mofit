import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Dimensions, DeviceEventEmitter } from 'react-native';
import StepCounter from '../components/StepCounter';
import { BarChart } from 'react-native-chart-kit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getAuth } from 'firebase/auth';

const screenWidth = Dimensions.get('window').width;
//  step page handling step bar chart
const StepPage = () => {
  const [weeklySteps, setWeeklySteps] = useState({
    Sun: 0,
    Mon: 0,
    Tue: 0,
    Wed: 0,
    Thu: 0,
    Fri: 0,
    Sat: 0,
  });

  const auth = getAuth();
  const user = auth.currentUser;
  // get weekly steps from async storage
  useEffect(() => {
    const getWeeklyStepsFromStorage = async () => {
      try {
        const storedSteps = await AsyncStorage.getItem(`weeklySteps-${user.uid}`);
        if (storedSteps) {
          setWeeklySteps(JSON.parse(storedSteps));
        }
      } catch (error) {
        console.error('Failed to load weekly steps:', error);
      }
    };

    getWeeklyStepsFromStorage();

    // listen for step change
    const stepCountChangedListener = DeviceEventEmitter.addListener(
      'stepCountChanged',
      handleStepCountChange
    );

    return () => {
      
      stepCountChangedListener.remove();
    };
  }, []);
  // 
  const handleStepCountChange = async (newStepCount) => {
    const today = new Date();
    const dayOfWeek = today.toLocaleString('en-US', { weekday: 'short' });

    setWeeklySteps((prevWeeklySteps) => {
      const updatedWeeklySteps = { ...prevWeeklySteps, [dayOfWeek]: newStepCount };
      AsyncStorage.setItem(`weeklySteps-${user.uid}`, JSON.stringify(updatedWeeklySteps));
      return updatedWeeklySteps;
    });
  };

  
  const data = {
    labels: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    datasets: [
      {
        data: [
          weeklySteps.Sun || 0,
          weeklySteps.Mon || 0,
          weeklySteps.Tue || 0,
          weeklySteps.Wed || 0,
          weeklySteps.Thu || 0,
          weeklySteps.Fri || 0,
          weeklySteps.Sat || 0,
        ],
      },
    ],
  };

  const maxStepCount = 8000;

  const chartConfig = {
    backgroundGradientFrom: '#121212',
    backgroundGradientTo: '#232323',
    fillShadowGradient: '#97FB57',
    fillShadowGradientOpacity: 1,
    color: (opacity = .5) => `rgba(255, 255, 255, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    barPercentage: 0.7,
    decimalPlaces: 0,
    style: {
      borderRadius: 16,
    },
    propsForBackgroundLines: {
      strokeWidth: 1,
      stroke: '#ccc',
    },
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={[StyleSheet.absoluteFill, { backgroundColor: '#121212' }]} />
      <View style={styles.container}>
        
        <StepCounter />

        <Text style={styles.title} marginTop={30}>Steps This Week</Text>

        <BarChart
          
          data={data}
          width={screenWidth - 40} 
          height={300}
          chartConfig={chartConfig}
          verticalLabelRotation={0}
          style={styles.chartStyle}
          fromZero={true}
          showValuesOnTopOfBars={true}
          yAxisLabel=""
          yAxisSuffix=""
          withInnerLines={true}
          segments={4} 
          yAxisInterval={maxStepCount / 4} 
        />
      </View>
    </View>
  );
};

export default StepPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
    marginTop: 60,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#97FB57',
    marginBottom: 20,
    textAlign: 'center',
  },
  chartStyle: {
    marginVertical: 8,
    borderRadius: 16,
  },
});
