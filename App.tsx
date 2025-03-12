import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// Importando as telas

import RegisterScreen from './src/screens/RegisterScreen';
import LoginScreen from './src/screens/LoginScreen';
import MaterialSelectionScreen from './src/screens/MaterialSelectionScreen';
import MapScreen from './src/screens/MapScreen';
import ChatScreen from './src/screens/ChatScreen';
import EducationScreen from './src/screens/EducationScreen';


const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
     <Stack.Navigator initialRouteName="Register">
  <Stack.Screen name="Register" component={RegisterScreen} />
  <Stack.Screen name="Login" component={LoginScreen} />
  <Stack.Screen name="MaterialSelection" component={MaterialSelectionScreen} />
  <Stack.Screen name="Map" component={MapScreen} />
  <Stack.Screen name="Chat" component={ChatScreen} />
  <Stack.Screen name="Education" component={EducationScreen} />
</Stack.Navigator>

    </NavigationContainer>
  );
}
