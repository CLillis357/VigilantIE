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
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';

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


export default function HomeScreen() {
  const [crimeReports, setCrimeReports] = useState([]);
  const router = useRouter();

  useEffect(() => {
    fetchCrimeReports();
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

  const deleteReport = async (id) => {
    try {
      await deleteDoc(doc(db, 'reports', id));
      setCrimeReports((prev) => prev.filter((r) => r.id !== id));
    } catch (error) {
      console.error('Error deleting report: ', error);
      Alert.alert('Error', 'Could not delete report');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <MapView
        style={styles.map}
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
    title={`${getEmojiForCrime(crime.type)} ${crime.type}`}
    description={`Tap here to remove this report.`}
    onCalloutPress={() => deleteReport(crime.id)} 
  >
    <View style={{ backgroundColor: 'white', padding: 6, borderRadius: 20 }}>
      <Text style={{ fontSize: 20 }}>
        {getEmojiForCrime(crime.type) || '❓'}
      </Text>
    </View>
  </Marker>
))}

      </MapView>


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
    </SafeAreaView>

    
  );
  
}


const styles = StyleSheet.create({
  container: { flex: 1 },
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
});
