import React from 'react';
import { Text, View, StyleSheet } from 'react-native';

// main title for log in screen ----- update font family for better font
const Title = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>MoFit</Text>
      <Text style={styles.tag}>Motivation + Fitness</Text>
    </View>
  );
};

export default Title;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: '15%',  
    left: '15%',  
    marginBottom: 100,
  },
  title: {
    fontSize: 55,
    fontWeight: 'bold',
    color: '#97FB57',
    
  },
  tag: {
    color: '#F6F2F2',
    fontSize: 20,
  }
});
