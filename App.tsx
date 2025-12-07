// App.tsx
import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { auth } from './firebase';


import LoginScreen from './Screen/LoginScreen'
import ChatScreen from './Screen/ChatScreen';


export type RootStackParamList = {
  Login: undefined;
  Chat: undefined;
};


const Stack = createNativeStackNavigator<RootStackParamList>();


export default function App() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged((u) => {
        setUser(u);
        setLoading(false);
      });

      return () => unsubscribe();
  }, []);


  if (loading) return null; // bisa ganti spinner


  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (
          <Stack.Screen name="Chat" component={ChatScreen} />
        ) : (
          <Stack.Screen name="Login" component={LoginScreen} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}