import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase/firebaseConfig'; // Update the path
import AuthScreen from './screens/AuthScreen';
import MainTabs from './navigation/MainTabs';
import MenuDetailScreen from './screens/MenuDetailScreen';
import AdminScreen from './screens/AdminScreen';

const Stack = createNativeStackNavigator();

const App = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return unsubscribe; // Cleanup listener on unmount
  }, []);

  if (loading) {
    return null; // Show a loading indicator if necessary
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {user ? (
          <>
            <Stack.Screen name="HomeTabs" component={MainTabs} options={{ headerShown: false }} />
            <Stack.Screen name="MenuDetail" component={MenuDetailScreen} options={{headerTintColor: "#D24545", headerBackTitle: "Back"}} /> 
            <Stack.Screen name="AdminScreen" component={AdminScreen} options={{headerTintColor: "#D24545", headerBackTitle: "Back"}} /> 
          </>
        ) : (
          <Stack.Screen name="Auth" component={AuthScreen} options={{ headerShown: false }} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;