import React, { useEffect, useRef } from 'react';
import { View, Text, Image, Animated, Easing, StyleSheet } from 'react-native';
import { Audio } from 'expo-av';

const SplashScreen = ({ navigation }) => {
  // Animações
  const logoRotation = useRef(new Animated.Value(0)).current;
  const fadeInRecicle = useRef(new Animated.Value(0)).current;
  const fadeInRespeite = useRef(new Animated.Value(0)).current;
  const fadeInRepense = useRef(new Animated.Value(0)).current;
  const slideUpText = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    async function playSound() {
      try {
        const { sound } = await Audio.Sound.createAsync(
          require('../assets/piano.log.mp3')
        );
        await sound.setPositionAsync(0); // Reinicia o som
        await sound.playAsync();
      } catch (error) {
        console.log('Erro ao carregar som:', error);
      }
    }
    

    playSound();

    // Animação da logo girando
    Animated.timing(logoRotation, {
      toValue: 1,
      duration: 2000,
      easing: Easing.linear,
      useNativeDriver: false,
    }).start();
    <Animated.Text 
    style={[
      styles.welcomeText, 
      { opacity: fadeInRecicle }
    ]}
  >
    Bem-vindo ao ReciclEsye!
  </Animated.Text>

    // Animação dos textos com efeito de fade-in e subida
    Animated.sequence([
      Animated.delay(500),
      Animated.parallel([
        Animated.timing(fadeInRecicle, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(slideUpText, {
          toValue: 0,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
      Animated.delay(500),
      Animated.parallel([
        Animated.timing(fadeInRespeite, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
      Animated.delay(500),
      Animated.parallel([
        Animated.timing(fadeInRepense, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
     

    ]).start();

    // Ir para a tela de cadastro após 5 segundos
    setTimeout(() => {
      navigation.replace('Register');
    }, 5000);
  }, []);

  return (
    <View style={styles.container}>
      <Animated.Image
        source={require('../assets/logo.png')} // Certifique-se de que a logo está na pasta "assets"
        style={[
          styles.logo,
          {
            transform: [
              {
                rotate: logoRotation.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0deg', '360deg'],
                }),
              },
            ],
          },
        ]}
      />
     <Animated.Text style={[styles.text, { opacity: fadeInRecicle, transform: [{ translateY: slideUpText }] }]}>
  Recicle
</Animated.Text>
<Animated.Text style={[styles.text, { opacity: fadeInRespeite }]}>
  Respeite
</Animated.Text>
<Animated.Text style={[styles.text, { opacity: fadeInRepense }]}>
  Repense
</Animated.Text>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4CAF50', // Fundo verde claro
  },
  logo: {
    width: 180,
    height: 180,
    marginBottom: 20,
  },
  text: {
    fontSize: 26,
    fontWeight: 'bold',
    color: 'white',
    marginVertical: 5,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 5,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 20,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 5,
  },
  
});

export default SplashScreen;
