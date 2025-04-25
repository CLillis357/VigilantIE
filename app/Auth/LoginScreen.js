import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Alert, Text } from 'react-native';
import { signInWithEmailAndPassword, getAuth } from 'firebase/auth';
import { useRouter } from 'expo-router';

export default function LoginScreen() {
  const [email, setEmail] = useState(''); // State to store the user's email
  const [password, setPassword] = useState(''); // State to store the user's password
  const router = useRouter(); // Navigation hook from Expo Router

  // Function to handle user login
  const handleLogin = () => {
    const auth = getAuth(); // Get the Firebase Auth instance
    signInWithEmailAndPassword(auth, email, password)
      .then(() => {
        // Navigate to the Home screen after successful login
        router.replace('/HomeScreen');
      })
      .catch((error) => {
        // Show an alert if login fails
        Alert.alert('Login Failed', error.message);
      });
  };

  return (
    <View style={styles.container}>
      {/* Login Title */}
      <Text style={styles.title}>Login</Text>

      {/* Email Input */}
      <TextInput
        placeholder="Email"
        style={styles.input}
        value={email}
        autoCapitalize="none" // Disable auto-capitalization for email input
        onChangeText={setEmail} // Update email state
      />

      {/* Password Input */}
      <TextInput
        placeholder="Password"
        style={styles.input}
        value={password}
        secureTextEntry // Hide password input
        onChangeText={setPassword} // Update password state
      />

      {/* Login Button */}
      <Button title="Login" onPress={handleLogin} />

      {/* Link to Register Screen */}
      <Text style={styles.link} onPress={() => router.push('/Auth/RegisterScreen')}>
        Don't have an account? Register
      </Text>
    </View>
  );
}

// Styles for the Login screen
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#fff', 
  },
  title: {
    fontSize: 24,
    marginBottom: 24,
    textAlign: 'center', 
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    marginBottom: 12,
    borderRadius: 8, 
  },
  link: {
    color: 'blue',
    textAlign: 'center',
    marginTop: 16, 
  },
});
