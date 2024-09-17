import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView } from 'react-native';
import { getAuth } from 'firebase/auth'; 
import { doc, getDoc } from 'firebase/firestore';
import { db } from './firebaseConfig'; 
import appStyles from '../components/Styles'; 
import { useNavigation } from '@react-navigation/native';

import DailyQuote from '../components/DailyQuote';
import DashboardStepCounter from '../components/DashboardStepCounter';

const Dashboard = ({ navigation }) => {
  const [userName, setUserName] = useState('');
  const [profilePicture, setProfilePicture] = useState(null);

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

  const handleLogout = () => {
    const auth = getAuth();
    auth.signOut().then(() => {
      navigation.replace('Login'); 
    })
  };

  const handleStepCounterPress = () => {
    navigation.navigate('StepPage');
  };



  return (
    <View style={appStyles.container}>
     
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

        <View style={styles.stepCard}>
            <DashboardStepCounter />
          </View>
    </View>
    

    
  );
};

export default Dashboard;

const styles = {
  welcomeContainer: {
    flexDirection: 'row', 
    alignItems: 'center',
    justifyContent: 'left', 
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
  stepCard: {
    bottom: 300,
    left: 70,
    
  },
};
