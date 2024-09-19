import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { getAuth } from 'firebase/auth'; 
import { doc, getDoc } from 'firebase/firestore';
import { db } from './firebaseConfig'; 
import { FontAwesome5 } from '@expo/vector-icons';

import DailyQuote from '../components/DailyQuote';
import DashboardStepCounter from '../components/DashboardStepCounter';
import DailyChallengeCard from '../components/DailyChallenge';

const Dashboard = ({ navigation }) => {
  const [userName, setUserName] = useState('');
  const [profilePicture, setProfilePicture] = useState(null);
  // retrive user dada for profile pic and name
  useEffect(() => {
    const fetchUserData = async () => {
      const auth = getAuth(); 
      const user = auth.currentUser;

      if (user) {
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const userData = docSnap.data();
          setUserName(userData.first_name || 'User');
          setProfilePicture(userData.profilePicture || null);
        } 
      }
    };

    fetchUserData();
  }, []);
        // logout button logic
  const handleLogout = () => {
    const auth = getAuth();
    auth.signOut().then(() => {
      navigation.replace('Login'); 
    });
  };
  // gym button logic
  const handleShowGyms = () => {
    navigation.navigate('Map'); 
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={[StyleSheet.absoluteFill, { backgroundColor: '#121212' }]} />
      <View style={styles.container}>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>

        <View style={styles.welcomeContainer}>
          {profilePicture ? (
            <Image 
              source={{ uri: profilePicture }} 
              style={styles.profileImage} 
            />
          ) : (
            <Image 
              source={require('../assets/default-profile.png')} 
              style={styles.profileImage} 
            />
          )}
          <Text style={styles.welcomeText}>Welcome {userName}</Text>
        </View>

        <DailyQuote />

    
        <View style={styles.cardContainer}>
          <TouchableOpacity style={styles.gymButton} onPress={handleShowGyms}>
            <FontAwesome5 name="dumbbell" size={50} color="#97FB57" style={styles.icon} />
            <Text style={styles.gymButtonText}>Show gyms near me</Text>
          </TouchableOpacity>

          <View style={styles.stepCard}>
            <DashboardStepCounter />
          </View>
        </View>

        
        <DailyChallengeCard style={styles.dailyChallengeCard} />
      </View>
    </View>
  );
};

export default Dashboard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  welcomeContainer: {
    flexDirection: 'row', 
    alignItems: 'center',
    justifyContent: 'flex-start', 
    marginVertical: 40, 
  },
  profileImage: {
    width: 50, 
    height: 50, 
    borderRadius: 25, 
    marginRight: 10, 
  },
  welcomeText: {
    fontSize: 24, 
    fontWeight: 'bold', 
    color: '#97FB57', 
  },
  logoutButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#97FB57',
    padding: 10,
    borderRadius: 5,
    marginTop: 40,
  },
  logoutText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  cardContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginTop: 20,
  },
  gymButton: {
    backgroundColor: '#1E1E1E',
    width: 150, 
    height: 175,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    shadowColor: '#97FB57',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 3,
    elevation: 5,
    borderWidth: 1,
  },
  gymButtonText: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
    paddingHorizontal: 10,
  },
  stepCard: {
    width: 150,
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dailyChallengeCard: {
    marginTop: 30,
  },
});
