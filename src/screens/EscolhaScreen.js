import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const EscolhaScreen = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>O que você deseja fazer?</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Register')}  // Corrigido
      >
        <Text style={styles.buttonText}>Quero Descartar</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('RegisterCollector')}  // Corrigido
      >
        <Text style={styles.buttonText}>Quero Coletar</Text>
      </TouchableOpacity>
    </View>
  );
};




const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#a8f9d2',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#15B392',
    marginBottom: 40,
  },
  button: {
    backgroundColor: '#15B392',
    paddingVertical: 12,
    paddingHorizontal: 80,
    borderRadius: 10,
    marginBottom: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default EscolhaScreen;
