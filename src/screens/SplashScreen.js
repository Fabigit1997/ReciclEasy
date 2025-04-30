import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Animated, ImageBackground } from 'react-native';
import { MaterialCommunityIcons } from 'react-native-vector-icons';

const SplashScreen = ({ navigation }) => {
  const rotateAnim = useRef(new Animated.Value(0)).current; // Animação de rotação
  const fadeAnim = useRef(new Animated.Value(0)).current;   // Animação de opacidade
  const [text, setText] = useState('');
  const [isFinalText, setIsFinalText] = useState(false);    // Para saber se é "ReciclEasy"

  useEffect(() => {
    // Inicia a animação de rotação
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 5000,
        useNativeDriver: true,
      })
    ).start();

    const sequence = [
      { text: 'Repense', duration: 2000 },
      { text: 'Reduze', duration: 2000 },
      { text: 'ReciclEasy', duration: 4000 },
    ];

    let index = 0;

    const showNextText = () => {
      if (index < sequence.length) {
        const current = sequence[index];

        setText(current.text);
        setIsFinalText(current.text === 'ReciclEasy'); // Quando chegar no ReciclEasy, aumenta fonte

        fadeAnim.setValue(0);
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 1000, // Mais lento para dar o efeito de "aparecer suavemente"
          useNativeDriver: true,
        }).start();

        setTimeout(() => {
          index++;
          showNextText();
        }, current.duration);
      }
    };

    showNextText();

    const timer = setTimeout(() => {
      navigation.replace('Escolha');
    }, 9000); // Tempo total ajustado (2+2+4+buffer)

    return () => clearTimeout(timer);
  }, []);

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <ImageBackground
      source={require('../assets/background.png')}
      style={styles.container}
    >
      <View style={styles.overlay}>
        <Animated.View style={{ transform: [{ rotate }] }}>
          <MaterialCommunityIcons name="recycle" size={170} color="white" />
        </Animated.View>

        {/* Texto que aparece suavemente */}
        <Animated.Text style={[
          styles.text,
          isFinalText && styles.finalText, // Se for o último texto, aplica estilo maior
          { opacity: fadeAnim }
        ]}>
          {text}
        </Animated.Text>
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
    backgroundColor: 'rgba(0, 0, 0, 0)',
    padding: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 30,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 20,
    textAlign: 'center',
  },
  finalText: {
    fontSize: 40, // Fonte maior para "ReciclEasy"
    color: '#fff', // Verde claro para destacar, se quiser mudar a cor aqui
  },
});

export default SplashScreen;
