import React, { useState } from 'react';
import {
  View,
  TextInput,
  Button,
  Alert,
  ScrollView,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { addDoc, collection } from 'firebase/firestore';
import { db, auth } from '../firebaseConfig';
import Geocoder from 'react-native-geocoding';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { Ionicons } from '@expo/vector-icons';

Geocoder.init('AIzaSyCUArq8W1NLKOI7_7ST6BFcYFj95S0JAfs'); // Substitua pela sua API KEY

export default function CadastroCatador({ navigation }) {
  const [nome, setNome] = useState('');
  const [sobrenome, setSobrenome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [cep, setCep] = useState('');
  const [rua, setRua] = useState('');
  const [numero, setNumero] = useState('');
  const [bairro, setBairro] = useState('');
  const [cidade, setCidade] = useState('');
  const [uf, setUf] = useState('');
  const [cooperativa, setCooperativa] = useState('');
  const [registroCooperativa, setRegistroCooperativa] = useState('');
  const [emailError, setEmailError] = useState('');
  const [materiais, setMateriais] = useState({
    Plastico: false,
    Papelão: false,
    Vidro: false,
    Metal: false,
    Componentes_Eletrônicos:false
  });

  const validarCep = (cepDigitado) => /^[0-9]{8}$/.test(cepDigitado);
  const validarEmail = (emailDigitado) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailDigitado);

  const handleMaterialChange = (tipo) => {
    setMateriais({ ...materiais, [tipo]: !materiais[tipo] });
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
        setUf(data.uf);
      }
    } catch (error) {
      Alert.alert('Erro', 'Falha ao buscar o endereço!');
    }
  };

  const handleCadastro = async () => {
    if (!email || !senha || !nome || !cidade || !rua || !numero) {
      Alert.alert('Erro', 'Preencha todos os campos obrigatórios.');
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email.toLowerCase(), senha);
      const user = userCredential.user;

      const enderecoCompleto = `${rua}, ${numero}, ${bairro}, ${cidade} - ${uf}`;
      const geo = await Geocoder.from(enderecoCompleto);
      const location = geo.results[0].geometry.location;
      const materiaisSelecionados = Object.keys(materiais).filter((key) => materiais[key]);

await addDoc(collection(db, 'Catador'), {
  uid: user.uid,
  nome,
  sobrenome,
  telefone,
  email: email.toLowerCase(),
  cep,
  rua,
  numero,
  bairro,
  cidade,
  uf,
  cooperativa,
  registroCooperativa,
  latitude: location.lat,
  longitude: location.lng,
  materiais: materiaisSelecionados, // <-- Agora é um array de strings
});


      Alert.alert('Sucesso', 'Catador cadastrado com sucesso!');
      navigation.navigate('Home');
    } catch (error) {
      console.error('Erro ao cadastrar:', error);
      let mensagem = 'Erro ao cadastrar. Verifique os dados.';
      if (error.code === 'auth/email-already-in-use') {
        mensagem = 'Este email já está em uso.';
      } else if (error.code === 'auth/invalid-email') {
        mensagem = 'Email inválido.';
      } else if (error.code === 'auth/weak-password') {
        mensagem = 'A senha deve ter pelo menos 6 caracteres.';
      }
      Alert.alert('Erro', mensagem);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TextInput style={styles.input} placeholder="Nome" value={nome} onChangeText={setNome} />
      <TextInput style={styles.input} placeholder="Sobrenome" value={sobrenome} onChangeText={setSobrenome} />
      <TextInput
        style={[styles.input, emailError ? styles.inputError : null]}
        placeholder="E-mail"
        value={email}
        onChangeText={(text) => {
          const lower = text.toLowerCase();
          setEmail(lower);
          if (!validarEmail(lower)) {
            setEmailError('Digite um email válido.');
          } else {
            setEmailError('');
          }
        }}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}

      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.passwordInput}
          placeholder="Senha"
          value={senha}
          onChangeText={setSenha}
          secureTextEntry={!mostrarSenha}
        />
        <TouchableOpacity onPress={() => setMostrarSenha(!mostrarSenha)}>
          <Ionicons name={mostrarSenha ? 'eye' : 'eye-off'} size={24} color="gray" />
        </TouchableOpacity>
      </View>

      <TextInput style={styles.input} placeholder="Telefone" value={telefone} onChangeText={formatarTelefone} keyboardType="phone-pad" />
      <TextInput style={styles.input} placeholder="CEP" value={cep} onChangeText={(text) => {
        setCep(text);
        if (text.length === 8) buscarEndereco(text);
      }} keyboardType="numeric" />
      <TextInput style={styles.input} placeholder="Rua" value={rua} onChangeText={setRua} />
      <TextInput style={styles.input} placeholder="Número" value={numero} onChangeText={setNumero} keyboardType="numeric" />
      <TextInput style={styles.input} placeholder="Bairro" value={bairro} onChangeText={setBairro} />
      <TextInput style={styles.input} placeholder="Cidade" value={cidade} onChangeText={setCidade} />
      <TextInput style={styles.input} placeholder="UF" value={uf} onChangeText={setUf} />
      <TextInput style={styles.input} placeholder="Cooperativa" value={cooperativa} onChangeText={setCooperativa} />
      <TextInput style={styles.input} placeholder="Registro da Cooperativa" value={registroCooperativa} onChangeText={setRegistroCooperativa} />

      <Text style={styles.label}>Materiais que coleta:</Text>
      {Object.keys(materiais).map((tipo) => (
        <TouchableOpacity key={tipo} style={styles.checkbox} onPress={() => handleMaterialChange(tipo)}>
          <Text style={{ color: materiais[tipo] ? 'green' : 'black' }}>
            {materiais[tipo] ? '✔️' : '⬜'} {tipo.charAt(0).toUpperCase() + tipo.slice(1)}
          </Text>
        </TouchableOpacity>
      ))}

      <TouchableOpacity style={styles.button} onPress={handleCadastro}>
        <Text style={styles.buttonText}>Cadastrar</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#a8f9d2',
    alignItems: 'center',
  },
  input: {
    width: '100%',
    height: 42,
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginVertical: 6,
    elevation: 2,
  },
  inputError: {
    borderColor: 'red',
    borderWidth: 1,
  },
  errorText: {
    color: 'red',
    alignSelf: 'flex-start',
    marginLeft: 10,
    fontSize: 12,
    marginTop: -5,
  },
  passwordContainer: {
    width: '100%',
    height: 42,
    backgroundColor: '#fff',
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    marginVertical: 6,
    elevation: 2,
  },
  passwordInput: {
    flex: 1,
  },
  checkbox: {
    alignSelf: 'flex-start',
    marginVertical: 4,
  },
  label: {
    marginTop: 10,
    marginBottom: 4,
    fontWeight: 'bold',
    alignSelf: 'flex-start',
  },
  button: {
    backgroundColor: '#15B392',
    paddingVertical: 12,
    paddingHorizontal: 60,
    borderRadius: 8,
    marginTop: 20,
    elevation: 3,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
