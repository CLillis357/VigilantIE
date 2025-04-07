import 'expo-router/entry';


import AuthLanding from './app/Auth/AuthLanding';
import LoginScreen from './app/Auth/LoginScreen';
import RegisterScreen from './app/Auth/RegisterScreen';
import HomeScreen from './app/HomeScreen';
import ReportScreen from './src/screens/ReportScreen';
import AssistanceScreen from './src/screens/AssistanceScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="AuthLanding" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="AuthLanding" component={AuthLanding} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Report" component={ReportScreen} />
        <Stack.Screen name="Assistance" component={AssistanceScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
