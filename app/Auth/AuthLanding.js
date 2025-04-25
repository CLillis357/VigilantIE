// app/Auth/AuthLanding.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

export default function AuthLanding() {
  const router = useRouter(); // Navigation hook from Expo Router

  return (
    <View style={styles.container}>
      {/* App Title */}
      <Text style={styles.title}>Welcome to VigilantIE 🚨</Text>

      {/* Login Button */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push('/Auth/LoginScreen')}
      >
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

      {/* Register Button */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push('/Auth/RegisterScreen')}
      >
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>
    </View>
  );
}

// Styles for the AuthLanding screen
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff', 
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30, 
  },
  button: {
    backgroundColor: '#007AFF', 
    padding: 15,
    borderRadius: 10,
    marginBottom: 15, 
    width: 200, 
    alignItems: 'center', 
  },
  buttonText: {
    color: 'white', 
    fontWeight: 'bold',
    fontSize: 16, 
  },
});
