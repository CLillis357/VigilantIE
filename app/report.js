import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { db, auth } from '../src/config/firebase';
import { collection, addDoc } from 'firebase/firestore';

export default function ReportScreen() {
  const router = useRouter(); // Navigation hook from Expo Router
  const [selectedLocation, setSelectedLocation] = useState(null); // State to store the selected location

  // List of crime types
  const crimes = [
    'Theft',
    'Breaking & Entering',
    'Harassment',
    'Assault',
    'Antisocial Behaviour',
    'Vandalism',
    'Animal Abuse',
    'Suspicious Behaviour',
  ];

  // Function to handle map press and set the selected location
  const handleMapPress = (event) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    setSelectedLocation({ latitude, longitude });
  };

  // Function to report a crime
  async function reportCrime(type) {
    if (!selectedLocation || !selectedLocation.latitude || !selectedLocation.longitude) {
      Alert.alert('Error', 'Please select a valid location.');
      return;
    }

    try {
      // Add the crime report to the Firestore database
      await addDoc(collection(db, 'reports'), {
        type,
        latitude: selectedLocation.latitude,
        longitude: selectedLocation.longitude,
        timestamp: new Date(),
        userId: auth.currentUser?.uid,
      });

      Alert.alert('Reported', `Crime: ${type} has been submitted.`);
      router.replace('/HomeScreen'); // Navigate back to the home screen
    } catch (error) {
      console.error('Error saving report:', error);
      Alert.alert('Error', 'Failed to report crime.');
    }
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <StatusBar style="light" backgroundColor="transparent" translucent />

      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.cancelText}>CANCEL</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Report</Text>
        </View>

        {/* Map for selecting a location */}
        <MapView
          style={styles.map}
          onPress={handleMapPress}
          initialRegion={{
            latitude: 53.283,
            longitude: -9.038,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
        >
          {/* Marker for the selected location */}
          {selectedLocation && (
            <Marker coordinate={selectedLocation} pinColor="red" />
          )}
        </MapView>

        {/* Grid of crime types */}
        <View style={styles.grid}>
          {crimes.map((crime, index) => (
            <TouchableOpacity
              key={index}
              style={styles.crimeButton}
              onPress={() => reportCrime(crime)}
            >
              <Text style={styles.crimeText}>{crime}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// Styles for the Report screen
const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: 'red',
    flex: 1,
  },
  scroll: {
    paddingBottom: 30,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'red',
    padding: 16,
  },
  cancelText: {
    color: 'white',
    fontWeight: 'bold',
  },
  headerTitle: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 20,
    flex: 1,
    textAlign: 'center',
    marginRight: 40,
  },
  map: {
    height: 250,
    width: '100%',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: 20,
  },
  crimeButton: {
    backgroundColor: '#7F8C8D',
    width: 150,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    margin: 10,
  },
  crimeText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
  },
});