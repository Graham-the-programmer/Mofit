import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';


import appStyles from '../components/Styles'; 

const DailyQuote = () => {
  const [quote, setQuote] = useState('');
  const [author, setAuthor] = useState('');

  useEffect(() => {
    const fetchQuote = async () => {
      try {
        const response = await fetch('https://zenquotes.io/api/today'); 
        const data = await response.json();
        setQuote(data[0].q);  
        setAuthor(data[0].a);  
      } catch (error) {
        console.error('Error fetching quote:', error);
      }
    };

    fetchQuote(); 
  }, []);

  return (
    <View style={appStyles.container}>
      <View style={styles.quoteCard}>
        <Text style={styles.quoteText}>“{quote}”</Text>
        {author && <Text style={styles.authorText}>- {author}</Text>}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  quoteCard: {
    backgroundColor: '#1E1E1E', 
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 5,
    elevation: 5,
    margin: 5,
    marginTop: -30,
  },
  quoteText: {
    fontSize: 18,
    fontStyle: 'italic',
    color: '#97FB57',
    textAlign: 'center',
  },
  authorText: {
    fontSize: 16,
    color: '#f2f6f6',
    textAlign: 'center',
    marginTop: 10,
  },
});

export default DailyQuote;
