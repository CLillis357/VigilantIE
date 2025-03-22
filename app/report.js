import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import MapView, { Marker } from 'react-native-maps';
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
    if (!selectedLocation) {

      /* console.log("🚨 Attempting to report crime:", type);
    try {
      const docRef = await addDoc(collection(db, "reports"), {
        type,
        timestamp: new Date(),
      });
      console.log("✅ Report saved with ID:", docRef.id);
      Alert.alert("Success", `Reported: ${type}`);
      router.push('/'); // Navigate back to home after crime reported
    } catch (error) {
      console.error("❌ Firestore error:", error);
      Alert.alert("Error", "Failed to report crime.");
    }*/

      Alert.alert("Select a location", "Please tap on the map where the incident occurred.");
      return;
    }

    try {
      const docRef = await addDoc(collection(db, "reports"), {
        type,
        latitude: selectedLocation.latitude,
        longitude: selectedLocation.longitude,
        timestamp: new Date(),
      });
      Alert.alert("Reported", `Crime: ${type} has been submitted.`);
      router.push('/');
    } catch (error) {
      console.error("Error saving report:", error);
      Alert.alert("Error", "Failed to report crime.");
    }
  }

  return (
    <View style={styles.container}>
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
        initialRegion={{
          latitude: 53.283,
          longitude: -9.038,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
        onPress={handleMapPress}
      >
        {selectedLocation && (
          <Marker coordinate={selectedLocation} pinColor="red" />
        )}
      </MapView>

      {/* Crime Types Grid */}
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'red',
    padding: 15,
    paddingTop: 50,
  },
  cancelText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
  headerTitle: { color: 'white', fontSize: 20, fontWeight: 'bold', flex: 1, textAlign: 'center' },
  map: { height: 250, width: '100%' },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    paddingTop: 20,
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
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
