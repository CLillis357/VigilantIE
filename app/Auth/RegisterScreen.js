import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Alert, Text } from 'react-native';
import { createUserWithEmailAndPassword, getAuth } from 'firebase/auth';
import { useRouter } from 'expo-router';

export default function RegisterScreen() {
  const [email, setEmail] = useState(''); // State to store the user's email
  const [password, setPassword] = useState(''); // State to store the user's password
  const router = useRouter(); // Navigation hook for routing

  // Function to handle user registration
  const handleRegister = () => {
    const auth = getAuth(); // Get Firebase Auth instance
    createUserWithEmailAndPassword(auth, email, password)
      .then(() => {
        router.replace('/HomeScreen'); // Navigate to HomeScreen on success
      })
      .catch((error) => {
        Alert.alert('Registration Failed', error.message); // Show error message on failure
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register</Text>

      {/* Email Input Field */}
      <TextInput
        placeholder="Email"
        style={styles.input}
        value={email}
        autoCapitalize="none" // Disable auto-capitalization for email
        onChangeText={setEmail}
      />

      {/* Password Input Field */}
      <TextInput
        placeholder="Password"
        style={styles.input}
        value={password}
        secureTextEntry // Mask password input
        onChangeText={setPassword}
      />

      {/* Register Button */}
      <Button title="Register" onPress={handleRegister} />

      {/* Link to Login Screen */}
      <Text style={styles.link} onPress={() => router.push('/Auth/LoginScreen')}>
        Already have an account? Login
      </Text>
    </View>
  );
}

// Styles for the Register screen
const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 24, marginBottom: 24, textAlign: 'center' },
  input: {
    borderWidth: 1, borderColor: '#ccc', padding: 12, marginBottom: 12, borderRadius: 8,
  },
  link: {
    color: 'blue', textAlign: 'center', marginTop: 16,
  },
});
