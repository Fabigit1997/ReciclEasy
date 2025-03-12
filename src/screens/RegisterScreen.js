import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { auth } from '../firebaseConfig';
import { createUserWithEmailAndPassword } from 'firebase/auth';

export default function CadastroScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    return password.length >= 6; 
  };

  const handleRegister = async () => {
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    if (!trimmedEmail || !trimmedPassword) {
      Alert.alert("Erro", "Por favor, preencha todos os campos!");
      return;
    }

    if (!validateEmail(trimmedEmail)) {
      Alert.alert("Erro", "Por favor, insira um e-mail válido!");
      return;
    }

    if (!validatePassword(trimmedPassword)) {
      Alert.alert("Erro", "A senha deve ter pelo menos 6 caracteres.");
      return;
    }

    setLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, trimmedEmail, trimmedPassword);
      Alert.alert("Sucesso!", "Conta criada com sucesso!");
      navigation.navigate("Login");
    } catch (error) {
      let errorMessage = "Falha ao criar conta. Tente novamente.";
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = "Este e-mail já está cadastrado.";
      } else if (error.code === 'auth/weak-password') {
        errorMessage = "A senha é muito fraca.";
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = "E-mail inválido.";
      }
      Alert.alert("Erro", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
     
      <Text style={styles.title}>Cadastro</Text>

      <View style={styles.inputContainer}>
        <Icon name="email" size={20} color="#63e6be0" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="E-mail"
          placeholderTextColor="#666"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>

      <View style={styles.inputContainer}>
        <Icon name="lock" size={20} color="#4CAF50" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Senha"
          placeholderTextColor="#666"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
      </View>

      <TouchableOpacity style={styles.button} onPress={handleRegister} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? "Carregando..." : "Cadastrar"}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.registerButton} onPress={() => navigation.navigate('Login')}>
        <Text style={styles.registerText}>Já tem uma conta? Faça login</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E8F5E9',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },

  
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 10,
    marginVertical: 10,
    width: '100%',
    elevation: 3,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 50,
    color: '#333',
  },
  button: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    paddingHorizontal: 80,
    borderRadius: 10,
    marginTop: 20,
    elevation: 3,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  registerButton: {
    marginTop: 20,
  },
  registerText: {
    color: '#2E7D32',
    fontSize: 16,
  },
});
