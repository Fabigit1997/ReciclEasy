import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// Importando as telas
import SplashScreen from './src/screens/SplashScreen';
import EscolhaScreen from './src/screens/EscolhaScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import RegisterCollectorScreen from './src/screens/RegisterCollectorScreen';
import LoginScreen from './src/screens/LoginScreen';
import HomeScreen from './src/screens/HomeScreens';
import MaterialSelectionScreen from './src/screens/MaterialSelectionScreen';
import MapScreen from './src/screens/MapScreen';
import ChatScreen from './src/screens/ChatScreen';
import EducationScreen from './src/screens/EducationScreen';
import ForgotPasswordScreen from './src/screens/ForgotPasswordScreen';



const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
     <Stack.Navigator initialRouteName="Splash">
  <Stack.Screen name="Splash" component={SplashScreen} />
  <Stack.Screen name="Escolha" component={EscolhaScreen} />
  <Stack.Screen name="Register" component={RegisterScreen} />
  <Stack.Screen name="RegisterCollector" component={RegisterCollectorScreen} />
  <Stack.Screen name="Login" component={LoginScreen} />
  <Stack.Screen name="Home" component={HomeScreen} />
  <Stack.Screen name="MaterialSelection" component={MaterialSelectionScreen} />
  <Stack.Screen name="Map" component={MapScreen} />
  <Stack.Screen name="Chat" component={ChatScreen} />
  <Stack.Screen name="Education" component={EducationScreen} />
  <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
</Stack.Navigator>
    </NavigationContainer>
  );
}
