import { StyleSheet, Text, View, ImageBackground, KeyboardAvoidingView, Platform } from 'react-native';
import React, { useState } from 'react';
import { db } from './firebaseConfig'; 
import { doc, setDoc } from 'firebase/firestore';

import './firebaseConfig';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import Button from '../components/Button';
import Input from '../components/Input';
import appStyles from '../components/Styles';
import { useNavigation } from '@react-navigation/native';
import Title from '../components/Title';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const auth = getAuth();
  const navigation = useNavigation();

 
const createUser = () => {
  createUserWithEmailAndPassword(auth, email, password)
    .then(async (userCredentials) => {
      const user = userCredentials.user;
      console.log('Signed up:', user.email);
      await setDoc(doc(db, 'users', user.uid), {
        email: user.email,
        first_name: '', 
        last_name: '', 
        picture: '../assets/default-profile.png', 
      });
      navigation.navigate('Profile'); 
    })
    .catch((error) => alert(error.message));
};

  const signIn = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredentials) => {
        const user = userCredentials.user;
        console.log('Signed in:', user.email);
        navigation.navigate('MainTabs', { screen: 'Home' });
      })
      .catch(error => alert(error.message));
  };

  return (

    
    <ImageBackground
      source={require('../assets/login.jpg')} 
      style={styles.background}
      resizeMode="cover" 
    >
      <Title />
      <KeyboardAvoidingView
        style={styles.overlay}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20} 
      >
        <Input
          icon='email'
          placeholder={'Enter your email'}
          value={email}
          onChangeText={text => setEmail(text)}
        />
        <Input
          icon='lock'
          placeholder={'Enter your Password'}
          value={password}
          secureTextEntry
          onChangeText={text => setPassword(text)}
        />

        <Button title={'Login'} onPress={signIn}/>  
        <Button title={'Sign Up'} onPress={createUser}/>  
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}

export default LoginScreen;

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center', 
    alignItems: 'center', 
    padding: 50,
  },
  overlay: {
    width: '100%', 
    padding: 20, 
    backgroundColor: 'rgba(0, 0, 0, 0.5)', 
    borderRadius: 10, 
  },
});
