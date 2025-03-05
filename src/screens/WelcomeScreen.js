import React from 'react';
import { View, Text, Button } from 'react-native';

const WelcomeScreen = ({ navigation }) => {
  return (
    <View>
      <Text>Bem-vindo ao ReciclEsye!</Text>
      <Button title="Cadastrar" onPress={() => navigation.navigate('Register')} />
      <Button title="Entrar" onPress={() => navigation.navigate('Login')} />
    </View>
  );
};

export default WelcomeScreen;
