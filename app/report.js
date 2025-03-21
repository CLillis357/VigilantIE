import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { db } from '../src/config/firebase';
import { collection, addDoc } from 'firebase/firestore';

export default function ReportScreen() {
  const router = useRouter();

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

  //Function to save and store reported crime to firbase
  async function reportCrime(type) {
    console.log("🚨 Attempting to report crime:", type);
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
    }
  }

  return (
    <View style={styles.container}>
      {/* Top Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.cancelText}>CANCEL</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Report</Text>
      </View>

      {/* Crime Buttons Grid */}
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
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingTop: 50,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'red',
    padding: 15,
  },
  cancelText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  headerTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    flex: 1,
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
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
