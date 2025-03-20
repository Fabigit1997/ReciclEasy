import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Animated, ImageBackground } from 'react-native';
import { MaterialCommunityIcons } from 'react-native-vector-icons'; // Alternativa de ícone

const SplashScreen = ({ navigation }) => {
  const rotateAnim = new Animated.Value(0); // Inicializando a animação de rotação

  // Função de animação para o ícone de reciclagem
  useEffect(() => {
    // Animação de rotação infinita
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 5000, // Duração de 5 segundos para uma rotação completa
        useNativeDriver: true,
      })
    ).start();

    const timer = setTimeout(() => {
      navigation.replace('Escolha'); // Navega para a tela de escolha
    }, 5000); // Exibe por 5 segundos

    return () => clearTimeout(timer); // Limpa o timer ao desmontar
  }, []);

  // Função de interpolação para rotação contínua
  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'], // Faz o ícone girar
  });

  return (
    <ImageBackground
      source={require('../assets/background.png')} // Caminho da sua imagem de fundo
      style={styles.container}
    >
      <View style={styles.overlay}>
        {/* Logo do aplicativo */}
        <Text style={styles.logo}>ReciclEsye</Text>
        {/* Ícone de Reciclagem com animação */}
        <Animated.View style={{ transform: [{ rotate }] }}>
          <MaterialCommunityIcons name="recycle" size={150} color="white" />
        </Animated.View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0)', // Sobreposição para o texto e ícone
    padding: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
  },
});

export default SplashScreen;
