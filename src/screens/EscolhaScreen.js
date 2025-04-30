import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, ImageBackground } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const EscolhaScreen = () => {
  const navigation = useNavigation();

  const titleOpacity = useRef(new Animated.Value(0)).current;
  const titleScale = useRef(new Animated.Value(0.8)).current;
  const buttonsTranslateY = useRef(new Animated.Value(50)).current;
  const buttonsOpacity = useRef(new Animated.Value(0)).current;
  
  const [showTitle, setShowTitle] = useState(true); // Estado para controlar se o título aparece

  useEffect(() => {
    // Animação de entrada do título
    Animated.parallel([
      Animated.timing(titleOpacity, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: true,
      }),
      Animated.spring(titleScale, {
        toValue: 1,
        friction: 5,
        useNativeDriver: true,
      }),
    ]).start();

    // Depois de 2.5 segundos, faz a animação de saída do título
    const timeout = setTimeout(() => {
      Animated.timing(titleOpacity, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }).start(() => {
        setShowTitle(false); // Depois que sumir, remove do layout
      });

      // Anima os botões ao mesmo tempo
      Animated.parallel([
        Animated.timing(buttonsTranslateY, {
          toValue: 0,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(buttonsOpacity, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ]).start();
    }, 2500);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <ImageBackground
      source={require('../assets/background.png')}
      style={styles.background}
    >
      <View style={styles.container}>
        {showTitle && (
          <>
            <Animated.Text style={[styles.title, { opacity: titleOpacity, transform: [{ scale: titleScale }] }]}>
              Bem-vindo!
            </Animated.Text>
            <Animated.Text style={[styles.title, { opacity: titleOpacity, transform: [{ scale: titleScale }] }]}>
              O que você deseja fazer?
            </Animated.Text>
          </>
        )}

        <Animated.View style={{ transform: [{ translateY: buttonsTranslateY }], opacity: buttonsOpacity, width: '100%', alignItems: 'center' }}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('Register')}
            activeOpacity={0.7}
          >
            <Text style={styles.buttonText}>Quero Descartar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('RegisterCollector')}
            activeOpacity={0.7}
          >
            <Text style={styles.buttonText}>Quero Coletar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.loginButton}
            onPress={() => navigation.navigate('Login')}
            activeOpacity={0.7}
          >
            <Text style={styles.loginText}>Já tem uma conta? Faça login</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'vrgba(136, 197, 157, 0.5)',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 20,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#15B392',
    paddingVertical: 12,
    paddingHorizontal: 60,
    borderRadius: 10,
    marginTop: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    width: '80%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loginButton: {
    marginTop: 20,
  },
  loginText: {
    fontSize: 16,
    color: '#c0f7e2',
    fontWeight: 'bold',
  },
});

export default EscolhaScreen;
