import React, { useEffect, useState } from 'react';
import {StyleSheet, Text, View, ScrollView, TextInput, Button, Image, TouchableOpacity,SafeAreaView,} from 'react-native';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import * as ImagePicker from 'expo-image-picker';
import { db } from './firebaseConfig';

const ProfileScreen = () => {
  const [userData, setUserData] = useState({
    first_name: '',
    last_name: '',
    profilePicture: '',
    email: '',
  });

  const auth = getAuth();
  const user = auth.currentUser;
// fetch user data from firebas db
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setUserData(docSnap.data());
        } else {
          console.log('No such document!');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);
  // update firebase db with new user info
  const handleSave = async () => {
    try {
      const docRef = doc(db, 'users', user.uid);
      await updateDoc(docRef, {
        first_name: userData.first_name,
        last_name: userData.last_name,
        profilePicture: userData.profilePicture,
      });
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Error updating profile');
    }
  };
  // launch image picker from users pictures
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setUserData({ ...userData, profilePicture: result.assets[0].uri });
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={[StyleSheet.absoluteFill, { backgroundColor: '#121212' }]} />
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          <View style={styles.profileContainer}>
            <TouchableOpacity onPress={pickImage}>
              <Image
                source={
                  userData.profilePicture
                    ? { uri: userData.profilePicture }
                    : require('../assets/default-profile.png')
                }
                style={styles.profileImage}
              />
            </TouchableOpacity>
            <Text style={styles.title}>Edit Profile</Text>
            <Text style={styles.text}>Email: {user.email}</Text>

            <Text style={styles.label}>First Name</Text>
            <TextInput
              style={styles.input}
              placeholder="First Name"
              placeholderTextColor="#888"
              value={userData.first_name}
              onChangeText={(text) =>
                setUserData({ ...userData, first_name: text })
              }
            />

            <Text style={styles.label}>Last Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Last Name"
              placeholderTextColor="#888"
              value={userData.last_name}
              onChangeText={(text) =>
                setUserData({ ...userData, last_name: text })
              }
            />
            <Button title="Save" onPress={handleSave} />
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    
  },
  scrollViewContent: {
    flexGrow: 1,
  },
  profileContainer: {
    alignItems: 'center',
    marginTop: 20,
    paddingHorizontal: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#97FB57',
    marginBottom: 10,
  },
  text: {
    fontSize: 16,
    color: '#f2f6f6',
    marginBottom: 20,
  },
  label: {
    width: '100%',
    marginBottom: 5,
    marginTop: 10,
    fontSize: 16,
    color: '#f2f6f6',
    textAlign: 'left',
  },
  input: {
    width: '100%',
    padding: 10,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#97FB57',
    borderRadius: 5,
    color: '#f2f6f6',
  },
});
