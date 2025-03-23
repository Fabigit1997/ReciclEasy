import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Image, ActivityIndicator } from 'react-native';
import { auth, db, storage } from '../firebaseConfig';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { setDoc, doc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import * as ImagePicker from 'expo-image-picker';

export default function RegisterScreen({ navigation }) {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [endereco, setEndereco] = useState('');
  const [cep, setCep] = useState('');
  const [password, setPassword] = useState('');
  const [avatar, setAvatar] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Função para validar o CEP
  const validarCep = (cepDigitado) => {
    const cepRegex = /^[0-9]{8}$/; // Apenas números e exatamente 8 dígitos
    return cepRegex.test(cepDigitado);
  };

  // Função para buscar endereço pelo CEP
  const buscarEndereco = async (cepDigitado) => {
    if (!validarCep(cepDigitado)) {
      Alert.alert('Erro', 'CEP inválido! Digite um CEP com 8 números.');
      setEndereco('');
      return;
    }

    try {
      const response = await fetch(`https://viacep.com.br/ws/${cepDigitado}/json/`);
      const data = await response.json();
      if (data.erro) {
        Alert.alert('Erro', 'CEP não encontrado!');
        setEndereco('');
      } else {
        setEndereco(`${data.logradouro}, ${data.bairro}, ${data.localidade} - ${data.uf}`);
      }
    } catch (error) {
      Alert.alert('Erro', 'Falha ao buscar o endereço!');
    }
  };

  // Função para selecionar e fazer upload da imagem
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setAvatar(result.assets[0].uri);
    }
  };

  // Função para fazer upload da imagem para o Firebase Storage
  const uploadImage = async (uri) => {
    if (!uri) return null;

    setUploading(true);
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      const filename = `avatars/${auth.currentUser.uid}.jpg`;
      const storageRef = ref(storage, filename);
      
      await uploadBytes(storageRef, blob);
      const url = await getDownloadURL(storageRef);
      return url;
    } catch (error) {
      Alert.alert('Erro', 'Falha ao enviar a imagem.');
      return null;
    } finally {
      setUploading(false);
    }
  };

  const handleRegister = async () => {
    if (!nome || !telefone || !endereco || !cep || !password) {
      Alert.alert('Erro', 'Preencha todos os campos obrigatórios!');
      return;
    }

    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const userId = userCredential.user.uid;

      // Faz o upload da imagem e pega a URL
      const avatarUrl = await uploadImage(avatar);

      await setDoc(doc(db, 'usuario', userId), {
        nome,
        email,
        telefone,
        endereco,
        cep,
        avatar: avatarUrl || null,
      });

      Alert.alert('Sucesso!', 'Cadastro realizado com sucesso!');
      navigation.navigate('Login');
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
      <Text style={styles.title}>Cadastro de Usuario</Text>

      <TouchableOpacity style={styles.avatarContainer} onPress={pickImage}>
        {avatar ? (
          <Image source={{ uri: avatar }} style={styles.avatar} />
        ) : (
          <Text style={styles.avatarText}>Selecionar Foto</Text>
        )}
      </TouchableOpacity>

      <TextInput style={styles.input} placeholder="Nome Completo" value={nome} onChangeText={setNome} />
      <TextInput style={styles.input} placeholder="E-mail (opcional)" value={email} onChangeText={setEmail} keyboardType="email-address" />
      <TextInput style={styles.input} placeholder="Telefone" value={telefone} onChangeText={setTelefone} keyboardType="phone-pad" />

      <TextInput
        style={styles.input}
        placeholder="CEP"
        value={cep}
        onChangeText={(text) => {
          setCep(text);
          if (text.length === 8) buscarEndereco(text);
        }}
        keyboardType="numeric"
        maxLength={8}
      />

      <TextInput style={styles.input} placeholder="Endereço" value={endereco} onChangeText={setEndereco} editable={false} />

      <TextInput style={styles.input} placeholder="Senha" value={password} onChangeText={setPassword} secureTextEntry />

      <TouchableOpacity style={styles.button} onPress={handleRegister} disabled={loading || uploading}>
        {loading || uploading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Cadastrar</Text>}
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
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    padding: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 20,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    overflow: 'hidden',
  },
  avatar: {
    width: '100%',
    height: '100%',
    borderRadius: 50,
  },
  avatarText: {
    color: '#777',
    fontSize: 14,
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 15,
    marginVertical: 10,
    elevation: 3,
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
});
