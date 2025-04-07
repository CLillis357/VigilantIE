// FILE: app/index.js
import { Redirect } from 'expo-router';

export default function Index() {
  // When the app starts, send the user to the Auth Landing screen
  return <Redirect href="/Auth/AuthLanding" />;
}
