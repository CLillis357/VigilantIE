
import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Platform,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { useRouter } from 'expo-router';
import * as Location from 'expo-location';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { db } from '../src/config/firebase';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';

function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export default function HomeScreen() {
  const [crimeReports, setCrimeReports] = useState([]);
  const [selectedCrimeType, setSelectedCrimeType] = useState('All');
  const [showFilter, setShowFilter] = useState(false);
  const [selectedRadius, setSelectedRadius] = useState(5);
  const [showRadiusMenu, setShowRadiusMenu] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(null);

  const mapRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    fetchCrimeReports();
    getCurrentUserLocation();
  }, []);

  const fetchCrimeReports = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'reports'));
      const reports = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCrimeReports(reports);
    } catch (error) {
      console.error('Error fetching reports: ', error);
    }
  };

  const getCurrentUserLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status === 'granted') {
      const location = await Location.getCurrentPositionAsync({});
      setCurrentLocation(location.coords);
    }
  };

  const centerMapOnUser = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission denied', 'We need location access to center the map.');
        return;
      }
      const location = await Location.getCurrentPositionAsync({});
      mapRef.current?.animateToRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.02,
        longitudeDelta: 0.02,
      }, 1000);
    } catch (error) {
      console.error('Could not center map:', error);
      Alert.alert('Error', 'Unable to center map on your location.');
    }
  };

  const deleteReport = async (id) => {
    try {
      await deleteDoc(doc(db, 'reports', id));
      setCrimeReports((prev) => prev.filter((r) => r.id !== id));
    } catch (error) {
      console.error('Error deleting report: ', error);
      Alert.alert('Error', 'Could not delete report');
    }
  };

  const getEmojiForCrime = (crimeType) => {
    switch (crimeType) {
      case 'Theft': return '💰';
      case 'Breaking & Entering': return '🏠';
      case 'Harassment': return '🗣️';
      case 'Assault': return '👊';
      case 'Antisocial Behaviour': return '🤬';
      case 'Vandalism': return '🧱';
      case 'Animal Abuse': return '🐾';
      case 'Suspicious Behaviour': return '🕵️';
      default: return '⚠️';
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <StatusBar style="light" backgroundColor="transparent" translucent />

      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={{
          latitude: 53.283,
          longitude: -9.038,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
      >
        {crimeReports
          .filter((crime) =>
            selectedCrimeType === 'All' || crime.type === selectedCrimeType
          )
          .filter((crime) =>
            currentLocation
              ? getDistanceFromLatLonInKm(
                  currentLocation.latitude,
                  currentLocation.longitude,
                  crime.latitude,
                  crime.longitude
                ) <= selectedRadius
              : true
          )
          .map((crime) => (
            <Marker
              key={crime.id}
              coordinate={{
                latitude: crime.latitude,
                longitude: crime.longitude,
              }}
              title={`${getEmojiForCrime(crime.type)} ${crime.type}`}
              description={`Tap here to remove this report.`}
              onCalloutPress={() => deleteReport(crime.id)}
            >
              <View style={{ backgroundColor: 'white', padding: 6, borderRadius: 20 }}>
                <Text style={{ fontSize: 20 }}>{getEmojiForCrime(crime.type)}</Text>
              </View>
            </Marker>
          ))}
      </MapView>

      {showFilter && (
        <View style={styles.dropdown}>
          {['All', 'Theft', 'Breaking & Entering', 'Harassment', 'Assault', 'Antisocial Behaviour', 'Vandalism', 'Animal Abuse', 'Suspicious Behaviour'].map((type, index) => (
            <TouchableOpacity
              key={index}
              style={styles.dropdownItem}
              onPress={() => {
                setSelectedCrimeType(type);
                setShowFilter(false);
              }}
            >
              <Text>{type}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {showRadiusMenu && (
        <View style={styles.dropdown}>
          {[1, 5, 10, 25].map((r, i) => (
            <TouchableOpacity
              key={i}
              style={styles.dropdownItem}
              onPress={() => {
                setSelectedRadius(r);
                setShowRadiusMenu(false);
              }}
            >
              <Text>{r} KM</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      <View style={styles.topButtons}>
        <TouchableOpacity
          style={styles.assistanceButton}
          onPress={() => router.push('/Assistance')}
        >
          <Text style={styles.buttonText}>Immediate Assistance Info</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.reportButton}
          onPress={() => router.push('/Report')}
        >
          <Text style={styles.buttonText}>Report</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.bottomMenu}>
        <TouchableOpacity style={styles.menuButton} onPress={() => setShowFilter(prev => !prev)}>
          <Text style={styles.menuText}>{selectedCrimeType === 'All' ? 'Filter ▼' : `${selectedCrimeType} ▼`}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuButton} onPress={centerMapOnUser}>
          <Text style={styles.menuText}>📍 My Location</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuButton} onPress={() => setShowRadiusMenu(prev => !prev)}>
          <Text style={styles.menuText}>Radius: {selectedRadius}KM ▼</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  map: { flex: 1 },
  topButtons: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 60 : 40,
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
  buttonText: { color: 'white', fontWeight: 'bold' },
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
  dropdown: {
    position: 'absolute',
    bottom: 60,
    left: 10,
    right: 10,
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 10,
    zIndex: 1000,
    elevation: 4,
  },
  dropdownItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
});
