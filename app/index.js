import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const router = useRouter();

  // Sample crime data (replace with real data later)
  const crimeReports = [
    { id: 1, latitude: 53.283, longitude: -9.038, title: 'Incident 1' },
    { id: 2, latitude: 53.279, longitude: -9.044, title: 'Incident 2' },
    { id: 3, latitude: 53.275, longitude: -9.050, title: 'Incident 3' },
  ];

  return (
    <View style={styles.container}>
      {/* Google Map */}
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 53.283, // Default location
          longitude: -9.038,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
      >
        {crimeReports.map((crime) => (
          <Marker
            key={crime.id}
            coordinate={{ latitude: crime.latitude, longitude: crime.longitude }}
            title={crime.title}
            description="Crime Alert"
          >
            <View style={styles.marker}>
              <Text style={styles.markerText}>⚠️</Text>
            </View>
          </Marker>
        ))}
      </MapView>

      {/* Top Buttons */}
      <View style={styles.topButtons}>
        <TouchableOpacity style={styles.assistanceButton}>
          <Text style={styles.buttonText}>Immediate Assistance Info</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.reportButton} onPress={() => router.push('report')}>
          <Text style={styles.buttonText}>Report</Text>
        </TouchableOpacity>
      </View>

      {/* Bottom Menu */}
      <View style={styles.bottomMenu}>
        <TouchableOpacity style={styles.menuButton}>
          <Text style={styles.menuText}>Your Feed ▼</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuButton}>
          <Text style={styles.menuText}>Home ▼</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuButton}>
          <Text style={styles.menuText}>Radius: 5KM ▼</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  marker: { backgroundColor: 'yellow', padding: 5, borderRadius: 10 },
  markerText: { fontSize: 16 },

  // Top Buttons
  topButtons: {
    position: 'absolute',
    top: 40,
    left: 10,
    right: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  assistanceButton: { backgroundColor: 'blue', padding: 10, borderRadius: 8 },
  reportButton: { backgroundColor: 'brown', padding: 10, borderRadius: 8 },
  buttonText: { color: 'white', fontWeight: 'bold' },

  // Bottom Menu
  bottomMenu: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    right: 10,
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 8,
  },
  menuButton: { padding: 10 },
  menuText: { fontWeight: 'bold' },
});
