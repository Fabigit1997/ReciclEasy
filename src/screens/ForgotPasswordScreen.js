// ForgotPasswordScreen.jsx
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../firebaseConfig';

export default function ForgotPasswordScreen({ navigation }) {
  const [email, setEmail] = useState('');

  const handlePasswordReset = async () => {
    if (!email) {
      Alert.alert('Erro', 'Digite um email válido.');
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      Alert.alert('Sucesso', 'Um link de redefinição de senha foi enviado para seu e-mail.');
      navigation.goBack(); // volta para tela de login
    } catch (error) {
      Alert.alert('Erro', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Esqueci a Senha</Text>
      <TextInput
        style={styles.input}
        placeholder="Digite seu email"
        keyboardType="email-address"
        autoCapitalize="none"
        onChangeText={setEmail}
        value={email}
      />
      <TouchableOpacity style={styles.button} onPress={handlePasswordReset}>
        <Text style={styles.buttonText}>Enviar link de redefinição</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: 'center',
     padding: 20 ,
     backgroundColor: '#a8f9d2'
    },
  
  title: { 
    fontSize: 24,
     fontWeight: 'bold',
      marginBottom: 20, 
      textAlign: 'center' ,
        color: '#15B392'
    },
  input: {
     borderWidth: 1,
      borderColor: '#ccc',
       padding: 10,
        borderRadius: 8,
         marginBottom: 20 ,
         backgroundColor: '#fff'
        },
  button: {
     backgroundColor: '#15B392', 
     padding: 15,
      borderRadius: 8 
    },
  buttonText: { 
    color: '#fff', 
    textAlign: 'center',
     fontWeight: 'bold'
    },
});
