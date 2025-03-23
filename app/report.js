import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { useRouter } from 'expo-router';
import { db } from '../src/config/firebase';
import { collection, addDoc } from 'firebase/firestore';

export default function ReportScreen() {
  const router = useRouter();
  const [selectedLocation, setSelectedLocation] = useState(null);

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

  const handleMapPress = (event) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    setSelectedLocation({ latitude, longitude });
  };

  async function reportCrime(type) {
    if (!selectedLocation || !selectedLocation.latitude || !selectedLocation.longitude) {
      Alert.alert('Error', 'Please select a valid location.');
      return;
    }

    try {
      await addDoc(collection(db, 'reports'), {
        type,
        latitude: selectedLocation.latitude,
        longitude: selectedLocation.longitude,
        timestamp: new Date(),
      });

      Alert.alert('Reported', `Crime: ${type} has been submitted.`);
      router.push('/');
    } catch (error) {
      console.error('Error saving report:', error);
      Alert.alert('Error', 'Failed to report crime.');
    }
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.cancelText}>CANCEL</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Report</Text>
        </View>

        {/* Map */}
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
          {selectedLocation && (
            <Marker coordinate={selectedLocation} pinColor="red" />
          )}
        </MapView>

        {/* Crime Buttons */}
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

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: 'white' },
  scroll: { paddingBottom: 30 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'red',
    padding: 16,
  },
  cancelText: { color: 'white', fontWeight: 'bold' },
  headerTitle: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 20,
    flex: 1,
    textAlign: 'center',
    marginRight: 40, // makes space for centered title
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
