import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Alert, ActivityIndicator } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps'; // Import PROVIDER_GOOGLE
import * as Location from 'expo-location';

const MapScreen = () => {
  const [region, setRegion] = useState(null);
  const [gyms, setGyms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      // Request location permissions
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Permission to access location was denied');
        setLoading(false);
        return;
      }

      // Get the current location
      let location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;

      setRegion({
        latitude,
        longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });

      // Fetch nearby gyms
      await findNearbyGyms(latitude, longitude);
      setLoading(false);
    })();
  }, []);

  const findNearbyGyms = async (latitude, longitude) => {
    const apiKey = 'AIzaSyBkVgsMIqNACN89hJ1F1kvF-n6QE8Yjm_s'; // Replace with your actual Google Places API key
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=5000&type=gym&key=${apiKey}`
      );
      const result = await response.json();
      setGyms(result.results);
    } catch (error) {
      console.error('Error fetching gyms:', error);
      Alert.alert('Error', 'Could not fetch nearby gyms.');
    }
  };

  if (loading) {
    // Display a loading indicator while fetching location
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#97FB57" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {region ? (
        <MapView
          style={styles.map}
          initialRegion={region}
          showsUserLocation={true}
          provider={PROVIDER_GOOGLE} // Ensure the provider is set
        >
          {gyms.map((gym, index) => (
            <Marker
              key={index}
              coordinate={{
                latitude: gym.geometry.location.lat,
                longitude: gym.geometry.location.lng,
              }}
              title={gym.name}
              description={gym.vicinity}
            />
          ))}
        </MapView>
      ) : (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#97FB57" />
        </View>
      )}
    </View>
  );
};

export default MapScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
