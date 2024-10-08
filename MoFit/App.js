import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import StepCounter from './components/StepCounter';
import appStyles from './components/Styles';
import { NavigationContainer,  DefaultTheme } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons'; 
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage'; 

import Dashboard from './pages/Dashboard';
import LoginScreen from './pages/LoginScreen';
import ProfileScreen from './pages/ProfileScreen';
import StepPage from './pages/StepPage';
import MapPage from './pages/MapPage';



const MyTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: '#121212',
  },
};


export default function App() {
  const Stack = createStackNavigator();
  const Tab = createBottomTabNavigator();
  const auth = getAuth();

  
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        await AsyncStorage.setItem('user', JSON.stringify(user));
        setUser(user);
      } else {
        await AsyncStorage.removeItem('user');
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return null; 
  }

  
  function BottomTabNavigator() {
    return (
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            let iconName;

            if (route.name === 'Home') {
              iconName = 'home-outline';
            } else if (route.name === 'Profile') {
              iconName = 'person-outline';
            } else if (route.name === 'Steps') {
              iconName = 'footsteps-outline';
            }  else if (route.name === 'Map') {  
            iconName = 'map-outline';
          }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#97FB57',
          tabBarInactiveTintColor: 'white',
          tabBarStyle: {
            position: 'absolute', 
            borderTopLeftRadius: 15, 
            borderTopRightRadius: 15, 
            height: 60, 
            backgroundColor: '#909090', 
            shadowColor: '#000', 
            shadowOffset: { width: 0, height: 10 }, 
            shadowOpacity: 0.25, 
            shadowRadius: 3.5,
            elevation: 5, 
            borderBottomWidth: 0,
          },
        })}
      >
        <Tab.Screen name="Home" component={Dashboard} options={{ headerShown: false }} />
        <Tab.Screen name="Steps" component={StepPage} options={{ headerShown: false }} />
        <Tab.Screen name="Profile" component={ProfileScreen} options={{ headerShown: false }} />
        <Tab.Screen name="Map" component={MapPage} options={{ headerShown: false }} />
      </Tab.Navigator>
    );
  }

  // ---- not required??
  const handleLoginNavigation = (navigation) => {
    
    if (user) {
      navigation.navigate('MainTabs', { screen: 'Profile' }); 
    } else {
      navigation.navigate('Login'); 
    }
  };

  
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName={user ? 'MainTabs' : 'Login'}>
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="MainTabs" component={BottomTabNavigator} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
