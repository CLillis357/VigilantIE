import { View, Text, StyleSheet, Button } from 'react-native';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const router = useRouter(); // Access Expo Router navigation

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Welcome to VigilantIE</Text>
      <Button title="Report Crime" onPress={() => router.push('/ReportScreen')} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#000',
  },
  text: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
});
