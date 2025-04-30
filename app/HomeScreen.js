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
import { db, auth } from '../src/config/firebase';
import { signOut } from 'firebase/auth';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';

// Utility function to calculate the distance between two coordinates in kilometers
function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of the Earth in kilometers
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
  const router = useRouter(); // Navigation hook from Expo Router

  // State variables
  const [crimeReports, setCrimeReports] = useState([]); // List of crime reports
  const [selectedCrimeType, setSelectedCrimeType] = useState('All'); // Filter for crime type
  
  const [selectedTimeRange, setSelectedTimeRange] = useState('All Time'); // Filter for time range
  const [showTimeMenu, setShowTimeMenu] = useState(false); // Toggle for time range menu
  const [currentLocation, setCurrentLocation] = useState(null); // User's current location
  const [showUserFeed, setShowUserFeed] = useState(false); // Toggle for showing user-specific reports

  const mapRef = useRef(null); // Reference to the MapView component

  // Function to handle user logout
  const handleLogout = async () => {
    try {
      await signOut(auth); // Sign out the user
      router.replace('/Auth/AuthLanding'); // Redirect to the authentication landing page
    } catch (error) {
      Alert.alert('Logout Error', error.message); // Show an error alert if logout fails
    }
  };

  // Fetch crime reports and user location when the component mounts
  useEffect(() => {
    fetchCrimeReports();
    getCurrentUserLocation();
  }, []);

  // Alert the user if there are nearby crimes
  useEffect(() => {
    if (!currentLocation || crimeReports.length === 0) return;

    const nearbyCrimes = crimeReports.filter((report) => {
      const dist = getDistanceFromLatLonInKm(
        currentLocation.latitude,
        currentLocation.longitude,
        report.latitude,
        report.longitude
      );
      return dist <= 0.5; // within 500 meters
    });

    if (nearbyCrimes.length > 0) {
      Alert.alert(
        'Nearby Crime Alert',
        `⚠️ Caution: ${nearbyCrimes.length} recent report(s) were filed near your location.`
      );
    }
  }, [currentLocation, crimeReports]);

  // Fetch crime reports from the Firestore database
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

  // Get the user's current location
  const getCurrentUserLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status === 'granted') {
      const location = await Location.getCurrentPositionAsync({});
      setCurrentLocation(location.coords);
    }
  };

  // Center the map on the user's current location
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

  // Delete a crime report from the database
  const deleteReport = async (id) => {
    try {
      await deleteDoc(doc(db, 'reports', id));
      setCrimeReports((prev) => prev.filter((r) => r.id !== id));
    } catch (error) {
      console.error('Error deleting report: ', error);
      Alert.alert('Error', 'Could not delete report');
    }
  };

  // Filter crime reports based on the selected time range
  const filteredCrimeReports = crimeReports.filter((crime) => {
    const now = new Date();
    const crimeTime = crime.timestamp.toDate ? crime.timestamp.toDate() : new Date(crime.timestamp); // Convert Firestore Timestamp to Date if necessary

    switch (selectedTimeRange) {
      case 'Last Hour':
        return now - crimeTime <= 60 * 60 * 1000; // Crimes reported in the last hour
      case 'Today':
        return crimeTime.toDateString() === now.toDateString(); // Crimes reported today
      case 'This Week':
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(now.getDate() - 7);
        return crimeTime >= oneWeekAgo; // Crimes reported in the last 7 days
      default:
        return true; // 'All Time' or no filter
    }
  });

  // Get an emoji representation for a crime type
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

      {/* Dropdown menu for time range selection */}
      {showTimeMenu && (
        <View style={styles.dropdown}>
          {['All Time', 'Last Hour', 'Today', 'This Week'].map((range, i) => (
            <TouchableOpacity
              key={i}
              style={styles.dropdownItem}
              onPress={() => {
                setSelectedTimeRange(range);
                setShowTimeMenu(false);
              }}
            >
              <Text>{range}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* MapView displaying the user's location and crime reports */}
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={
          currentLocation ? {
            latitude: currentLocation.latitude,
            longitude: currentLocation.longitude,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          } : {
            latitude: 53.283, // fallback if location isn't ready
            longitude: -9.038,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          }
        }
      >
        {/* Marker for the user's current location */}
        {currentLocation && (
          <Marker
            coordinate={currentLocation}
            title="You are here"
            pinColor="blue"
          />
        )}

        {/* Markers for crime reports */}
        {filteredCrimeReports
          .filter(crime => selectedCrimeType === 'All' || crime.type === selectedCrimeType)
          .filter(crime =>
            currentLocation
              ? getDistanceFromLatLonInKm(
                  currentLocation.latitude,
                  currentLocation.longitude,
                  crime.latitude,
                  crime.longitude
                ) 
              : true
          )
          .filter(crime => !showUserFeed || crime.userId === auth.currentUser?.uid || !crime.userId)
          .map((crime) => (
            <Marker
              key={crime.id}
              coordinate={{
                latitude: crime.latitude,
                longitude: crime.longitude,
              }}
              title={`${getEmojiForCrime(crime.type)} ${crime.type}`}
              description={crime.userId === auth.currentUser?.uid ? 'Tap here to remove this report.' : undefined}
              onCalloutPress={crime.userId === auth.currentUser?.uid ? () => deleteReport(crime.id) : undefined}
            >
              <View style={{ backgroundColor: 'white', padding: 6, borderRadius: 20 }}>
                <Text style={{ fontSize: 20 }}>{getEmojiForCrime(crime.type)}</Text>
              </View>
            </Marker>
          ))}
      </MapView>


      {/* Top buttons for navigation */}
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
     
      {/* Logout button */}
      <TouchableOpacity style={styles.logoutFab} onPress={handleLogout}>
        <Text style={{ color: 'white', fontSize: 18 }}>🚪</Text>
      </TouchableOpacity>

      {/* Refresh button */}
      <TouchableOpacity style={styles.refreshFab} onPress={fetchCrimeReports}>
        <Text style={{ color: 'white', fontSize: 18 }}>🔄</Text>
      </TouchableOpacity>

      {/* Bottom menu for additional actions */}
      <View style={styles.bottomMenu}>
        <TouchableOpacity style={styles.menuButton} onPress={() => setShowTimeMenu(prev => !prev)}>
          <Text style={styles.menuText}>{selectedTimeRange} ▼</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuButton} onPress={() => setShowUserFeed(prev => !prev)}>
          <Text style={styles.menuText}>{showUserFeed ? 'Your Feed 👤' : 'Public Feed 🌍'}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuButton} onPress={centerMapOnUser}>
          <Text style={styles.menuText}>📍 My Location</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

// Styles for the components
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
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
  logoutFab: {
    position: 'absolute',
    bottom: 90,
    right: 20,
    backgroundColor: 'red',
    borderRadius: 30,
    padding: 12,
    elevation: 5,
  },
  refreshFab: {
    position: 'absolute',
    bottom: 90,
    left: 20,
    backgroundColor: 'green',
    borderRadius: 30,
    padding: 12,
    elevation: 5,
  },
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
