import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

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
          <TouchableOpacity key={index} style={styles.crimeButton}>
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
    backgroundColor: '#7F8C8D', // Grey color
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
