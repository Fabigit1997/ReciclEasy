import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import SplashScreen from './src/screens/SplashScreen';
import EscolhaScreen from './src/screens/EscolhaScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import RegisterCollectorScreen from './src/screens/RegisterCollectorScreen';
import LoginScreen from './src/screens/LoginScreen';
import HomeScreen from './src/screens/HomeScreens'; // Verifique o nome do arquivo!
import MaterialSelectionScreen from './src/screens/MaterialSelectionScreen';
import MapScreen from './src/screens/MapScreen';
import ChatScreen from './src/screens/ChatScreen';
import EducationScreen from './src/screens/EducationScreen';
import PontosService from './src/services/PontosService';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Splash" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Escolha" component={EscolhaScreen} />
        <Stack.Screen name="RegistroUsuario" component={RegisterScreen} />
        <Stack.Screen name="RegistroCatador" component={RegisterCollectorScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />  
        <Stack.Screen name="SelecaoMaterial" component={MaterialSelectionScreen} />
        <Stack.Screen name="Map" component={MapScreen} />
        <Stack.Screen name="Chat" component={ChatScreen} />
        <Stack.Screen name="ConteudoEducativo" component={EducationScreen} />
        <Stack.Screen name="Ponto de Serviço" component={PontosService}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
