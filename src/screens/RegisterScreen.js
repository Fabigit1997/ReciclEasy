import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, Alert, ActivityIndicator
} from 'react-native';
import { auth, db } from '../firebaseConfig';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { setDoc, doc } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

export default function RegisterScreen({ navigation }) {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [rua, setRua] = useState('');
  const [numeroResidencia, setNumeroResidencia] = useState('');
  const [bairro, setBairro] = useState('');
  const [cidade, setCidade] = useState('');
  const [cep, setCep] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [emailError, setEmailError] = useState('');

  const validarCep = (cepDigitado) => /^[0-9]{8}$/.test(cepDigitado);

  const validarEmail = (emailDigitado) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(emailDigitado);
  };

  const buscarEndereco = async (cepDigitado) => {
    if (!validarCep(cepDigitado)) {
      Alert.alert('Erro', 'CEP inválido! Digite um CEP com 8 números.');
      return;
    }
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cepDigitado}/json/`);
      const data = await response.json();
      if (data.erro) {
        Alert.alert('Erro', 'CEP não encontrado!');
      } else {
        setRua(data.logradouro);
        setBairro(data.bairro);
        setCidade(data.localidade);
      }
    } catch (error) {
      Alert.alert('Erro', 'Falha ao buscar o endereço!');
    }
  };

  const formatarTelefone = (text) => {
    const cleaned = text.replace(/\D/g, '');
    let formatted = '';

    if (cleaned.length <= 2) {
      formatted = `(${cleaned}`;
    } else if (cleaned.length <= 6) {
      formatted = `(${cleaned.slice(0, 2)}) ${cleaned.slice(2)}`;
    } else if (cleaned.length <= 10) {
      formatted = `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 6)}-${cleaned.slice(6)}`;
    } else {
      formatted = `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7, 11)}`;
    }
    setTelefone(formatted);
  };

  const saveUserData = async (nome, email, telefone, rua, numeroResidencia, bairro, cidade, cep) => {
    try {
      await AsyncStorage.setItem('user_data', JSON.stringify({ nome, email, telefone, rua, numeroResidencia, bairro, cidade, cep }));
    } catch (error) {
      console.error('Erro ao salvar dados:', error);
    }
  };

  const handleRegister = async () => {
    if (!nome || !telefone || !rua || !cep || !numeroResidencia || !bairro || !cidade || !password || !email) {
      Alert.alert('Erro', 'Preencha todos os campos!');
      return;
    }

    const emailMinusculo = email.toLowerCase();

    if (!validarEmail(emailMinusculo)) {
      setEmailError('Digite um email válido.');
      return;
    }

    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, emailMinusculo, password);
      const userId = userCredential.user.uid;

      await setDoc(doc(db, 'Usuario', userId), {
        nome,
        email: emailMinusculo,
        telefone,
        rua,
        numeroResidencia,
        bairro,
        cidade,
        cep,
      });

      await saveUserData(nome, emailMinusculo, telefone, rua, numeroResidencia, bairro, cidade, cep);

      Alert.alert('Sucesso!', 'Cadastro realizado com sucesso!');
      navigation.navigate('Home', {
        nome, email: emailMinusculo, telefone,
        rua, numeroResidencia, bairro, cidade, cep
      });
    } catch (error) {
      let errorMessage = 'Erro ao cadastrar. Tente novamente.';
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'Este e-mail já está cadastrado.';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'A senha deve ter pelo menos 6 caracteres.';
      }
      Alert.alert('Erro', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cadastro de Usuário</Text>

      <TextInput style={styles.input} placeholder="Nome Completo" value={nome} onChangeText={setNome} />

      <TextInput
        style={[styles.input, emailError ? styles.inputError : null]}
        placeholder="E-mail"
        value={email}
        onChangeText={(text) => {
          const lower = text.toLowerCase();
          setEmail(lower);
          setEmailError(validarEmail(lower) ? '' : 'Digite um email válido.');
        }}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}

      <TextInput style={styles.input} placeholder="Telefone" value={telefone} onChangeText={formatarTelefone} keyboardType="phone-pad" />
      <TextInput style={styles.input} placeholder="CEP" value={cep} onChangeText={(text) => setCep(text.replace(/\D/g, ''))} keyboardType="numeric" onBlur={() => buscarEndereco(cep)} />
      <TextInput style={styles.input} placeholder="Rua" value={rua} onChangeText={setRua} />
      <TextInput style={styles.input} placeholder="Número da residência" value={numeroResidencia} onChangeText={setNumeroResidencia} keyboardType="numeric" />
      <TextInput style={styles.input} placeholder="Bairro" value={bairro} onChangeText={setBairro} />
      <TextInput style={styles.input} placeholder="Cidade" value={cidade} onChangeText={setCidade} />

      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.passwordInput}
          placeholder="Senha"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!mostrarSenha}
        />
        <TouchableOpacity onPress={() => setMostrarSenha(!mostrarSenha)}>
          <Ionicons name={mostrarSenha ? 'eye' : 'eye-off'} size={24} color="gray" />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleRegister} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Cadastrar</Text>}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#a8f9d2', padding: 20 },
  title: { fontSize: 26, fontWeight: 'bold', color: '#15B392', marginBottom: 20 },
  input: { width: '100%', height: 50, backgroundColor: '#fff', borderRadius: 10, paddingHorizontal: 15, marginVertical: 8, elevation: 3 },
  inputError: { borderColor: 'red', borderWidth: 1 },
  errorText: { color: 'red', alignSelf: 'flex-start', marginLeft: 10, fontSize: 12, marginTop: -5 },
  passwordContainer: { width: '100%', height: 50, backgroundColor: '#fff', borderRadius: 10, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 15, marginVertical: 10, elevation: 3 },
  passwordInput: { flex: 1 },
  button: { backgroundColor: '#15B392', paddingVertical: 12, paddingHorizontal: 80, borderRadius: 10, marginTop: 20, elevation: 3 },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
});
