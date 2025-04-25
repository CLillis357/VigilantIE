import React from 'react';
import { View, Text, StyleSheet, Linking, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

export default function AssistanceScreen() {
  const router = useRouter(); // Navigation hook from Expo Router

  // Function to open the phone dialer with a specific number
  const openDialer = (number) => {
    Linking.openURL(`tel:${number}`);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Header */}
      <Text style={styles.header}>🚨 Emergency Assistance</Text>

      {/* Emergency contact options */}
      <TouchableOpacity style={styles.item} onPress={() => openDialer("112")}>
        <Text style={styles.title}>General Emergency (112)</Text>
        <Text style={styles.subtitle}>Call for police, ambulance, or fire</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.item} onPress={() => openDialer("999")}>
        <Text style={styles.title}>Emergency Services (999)</Text>
        <Text style={styles.subtitle}>Standard Irish emergency line</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.item} onPress={() => openDialer("116123")}>
        <Text style={styles.title}>Samaritans (116 123)</Text>
        <Text style={styles.subtitle}>Free 24/7 mental health support</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.item} onPress={() => openDialer("1800778888")}>
        <Text style={styles.title}>Crime Victim Helpline (1800 77 88 88)</Text>
        <Text style={styles.subtitle}>Support for victims of crime</Text>
      </TouchableOpacity>

      {/* Back button to navigate to the previous screen */}
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.backText}>⬅ Back to Map</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

// Styles for the Assistance screen
const styles = StyleSheet.create({
  container: { 
    padding: 20 
  },
  header: { 
    marginTop: 20, 
    fontSize: 24, 
    fontWeight: 'bold', 
    marginBottom: 20, 
    textAlign: 'center' 
  },
  item: {
    backgroundColor: '#e3f2fd',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
  },
  title: { 
    fontSize: 18, 
    fontWeight: 'bold' 
  },
  subtitle: { 
    fontSize: 14, 
    color: '#333', 
    marginTop: 5 
  },
  backButton: {
    marginTop: 20,
    alignSelf: 'center',
    padding: 10,
    backgroundColor: '#1976d2',
    borderRadius: 6,
  },
  backText: { 
    color: 'white', 
    fontWeight: 'bold' 
  },
});
