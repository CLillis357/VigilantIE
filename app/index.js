import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  Platform,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { useRouter } from 'expo-router';
import { db } from '../src/config/firebase';
import { collection, getDocs } from 'firebase/firestore';

export default function HomeScreen() {
  const router = useRouter();
  const [crimeReports, setCrimeReports] = useState([]);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'reports'));
        const reports = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCrimeReports(reports);
      } catch (error) {
        console.error('❌ Failed to fetch reports:', error);
        Alert.alert('Error', 'Failed to load crime reports.');
      }
    };

    fetchReports();
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <MapView
          style={StyleSheet.absoluteFillObject}
          initialRegion={{
            latitude: 53.283,
            longitude: -9.038,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          }}
        >
          {crimeReports.map((crime) => (
            <Marker
              key={crime.id}
              coordinate={{
                latitude: crime.latitude,
                longitude: crime.longitude,
              }}
              title={crime.type || crime.title}
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
          <TouchableOpacity
            style={styles.assistanceButton}
            onPress={() => router.push('/ImmediateAssist/assistance')}
          >
            <Text style={styles.buttonText}>Immediate Assistance Info</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.reportButton}
            onPress={() => router.push('/report')}
          >
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Platform.OS === 'android' ? 'white' : 'transparent',
  },
  container: {
    flex: 1,
  },
  marker: {
    backgroundColor: 'yellow',
    padding: 5,
    borderRadius: 10,
  },
  markerText: {
    fontSize: 16,
  },
  topButtons: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 30,
    left: 10,
    right: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  assistanceButton: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 8,
  },
  reportButton: {
    backgroundColor: 'brown',
    padding: 10,
    borderRadius: 8,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  bottomMenu: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: 'white',
    padding: 10,
    borderTopWidth: 1,
    borderColor: '#ccc',
  },
  menuButton: {
    padding: 10,
  },
  menuText: {
    fontWeight: 'bold',
  },
});
