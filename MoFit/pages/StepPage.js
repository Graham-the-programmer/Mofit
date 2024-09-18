// StepPage.js
import { StyleSheet, Text, View, Dimensions, ScrollView } from 'react-native';
import React, { useState, useEffect } from 'react';
import StepCounter from '../components/StepCounter';
import { BarChart } from 'react-native-chart-kit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getAuth } from 'firebase/auth';
import appStyles from '../components/Styles';

const screenWidth = Dimensions.get('window').width;

const StepPage = () => {
  const [weeklySteps, setWeeklySteps] = useState({
    Mon: 0,
    Tue: 0,
    Wed: 0,
    Thu: 0,
    Fri: 0,
    Sat: 0,
    Sun: 0,
  });

  const auth = getAuth();
  const user = auth.currentUser;

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
  }, []);

  const handleStepCountChange = async (newStepCount) => {
    const today = new Date();
    const dayOfWeek = today.toLocaleString('en-US', { weekday: 'short' });

    setWeeklySteps((prevWeeklySteps) => {
      const updatedWeeklySteps = { ...prevWeeklySteps, [dayOfWeek]: newStepCount };
      AsyncStorage.setItem(`weeklySteps-${user.uid}`, JSON.stringify(updatedWeeklySteps));
      return updatedWeeklySteps;
    });
  };

  // Prepare data for the chart
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

  const chartConfig = {
    backgroundGradientFrom: '#121212',
    backgroundGradientTo: '#232323',
    fillShadowGradient: '#97FB57',
    fillShadowGradientOpacity: 1,
    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
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
    <ScrollView style={appStyles.container} contentContainerStyle={{ flexGrow: 1 }}>
      <View style={appStyles.container}>
        <Text style={appStyles.title}>Step Counter</Text>
        <StepCounter onStepCountChange={handleStepCountChange} />

        <Text style={appStyles.title}>Steps This Week</Text>

        <ScrollView horizontal={true} style={styles.scrollContainer}>
          <BarChart
            data={data}
            width={screenWidth}
            height={300}
            chartConfig={chartConfig}
            verticalLabelRotation={0}
            style={styles.chartStyle}
            fromZero={true}
            showValuesOnTopOfBars={true}
            withInnerLines={true}
            yAxisLabel=""
            yAxisSuffix=" steps"
            yAxisInterval={1000}
          />
        </ScrollView>
      </View>
    </ScrollView>
  );
};

export default StepPage;

const styles = StyleSheet.create({
  scrollContainer: {
    flexDirection: 'row',
    paddingVertical: 10,
  },
  chartStyle: {
    marginVertical: 8,
    borderRadius: 16,
    paddingRight: 20,
  },
});
