import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, Alert, ActivityIndicator, Image
} from 'react-native';
import { auth, db, storage } from '../firebaseConfig';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { setDoc, doc } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

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
  const [imagem, setImagem] = useState(null);

  const escolherImagem = async () => {
    const permissao = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissao.status !== 'granted') {
      Alert.alert('Permissão negada!', 'Precisamos de acesso à galeria para continuar.');
      return;
    }

    const resultado = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!resultado.cancelled) {
      setImagem(resultado.assets[0].uri);
    }
  };

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

  const saveUserData = async (nome, email, telefone, rua, numeroResidencia, bairro, cidade, cep, image) => {
    try {
      await AsyncStorage.setItem(
        'user_data',
        JSON.stringify({ nome, email, telefone, rua, numeroResidencia, bairro, cidade, cep, image })
      );
    } catch (error) {
      console.error('Erro ao salvar dados:', error);
    }
  };

  const uploadImagemPerfil = async (imagemUri, userId) => {
    const response = await fetch(imagemUri);
    const blob = await response.blob();
    const imagemRef = ref(storage, `perfilUsuario/${userId}.jpg`);
    await uploadBytes(imagemRef, blob);
    return await getDownloadURL(imagemRef);
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
      let urlImagem = '';
      if (imagem) {
        urlImagem = await uploadImagemPerfil(imagem, userId);
      }

      await setDoc(doc(db, 'Usuario', userId), {
        nome,
        email: emailMinusculo,
        telefone,
        rua,
        numeroResidencia,
        bairro,
        cidade,
        cep,
        imagem: urlImagem,
      });

      await saveUserData(nome, emailMinusculo, telefone, rua, numeroResidencia, bairro, cidade, cep, imagem);

      Alert.alert('Sucesso!', 'Cadastro realizado com sucesso!');
      navigation.navigate('Home', {
        nome,
        email: emailMinusculo,
        telefone,
        rua,
        numeroResidencia,
        bairro,
        cidade,
        cep,
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

      <TextInput
        style={styles.input}
        placeholder="Nome Completo"
        value={nome}
        onChangeText={setNome}
      />

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

      <TextInput
        style={styles.input}
        placeholder="Telefone"
        value={telefone}
        onChangeText={formatarTelefone}
        keyboardType="phone-pad"
      />
      <TextInput
        style={styles.input}
        placeholder="CEP"
        value={cep}
        onChangeText={(text) => setCep(text.replace(/\D/g, ''))}
        keyboardType="numeric"
        onBlur={() => buscarEndereco(cep)}
      />
      <TextInput style={styles.input} placeholder="Rua" value={rua} onChangeText={setRua} />
      <TextInput
        style={styles.input}
        placeholder="Número da residência"
        value={numeroResidencia}
        onChangeText={setNumeroResidencia}
        keyboardType="numeric"
      />
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

      <TouchableOpacity style={styles.botaoImagem} onPress={escolherImagem}>
        <Text style={styles.botaoImagemTexto}>Selecionar Foto</Text>
      </TouchableOpacity>

      {imagem && (
        <Image
          source={{ uri: imagem }}
          style={{ width: 100, height: 100, borderRadius: 50, marginVertical: 10 }}
        />
      )}

      <TouchableOpacity style={styles.button} onPress={handleRegister} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Cadastrar</Text>}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff', paddingHorizontal: 20,
  },
  title: {
    fontSize: 24, fontWeight: 'bold', marginBottom: 20, color: '#15B392',
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#15B392',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
  inputError: {
    borderColor: 'red',
  },
  errorText: {
    color: 'red',
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#15B392',
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 10,
    width: '100%',
  },
  passwordInput: {
    flex: 1,
    paddingVertical: 10,
  },
  botaoImagem: {
    backgroundColor: '#15B392',
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 10,
    marginTop: 20,
    elevation: 3,
    alignItems: 'center',
  },
  botaoImagemTexto: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#15B392',
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 10,
    marginTop: 20,
    elevation: 3,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
