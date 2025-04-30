import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, ScrollView } from 'react-native';
import { auth, db } from '../firebaseConfig';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { setDoc, doc } from 'firebase/firestore';
import { MaterialCommunityIcons } from '@expo/vector-icons'; // para o ícone de olho

export default function RegisterCollectorScreen({ navigation }) {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [endereco, setEndereco] = useState('');
  const [numeroResidencia, setNumeroResidencia] = useState('');
  const [cep, setCep] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [materiais, setMateriais] = useState({
    plastico: false,
    metal: false,
    papelao: false,
    vidro: false,
    entulho: false,
    oleo: false,
  });

  const [cooperativa, setCooperativa] = useState('');
  const [registro, setRegistro] = useState('');

  // Formatar telefone automaticamente
  const formatarTelefone = (text) => {
    const cleaned = text.replace(/\D/g, '');
    const match = cleaned.match(/^(\d{0,2})(\d{0,5})(\d{0,4})$/);
    if (match) {
      const [, ddd, first, second] = match;
      return [ddd && `(${ddd}`, first && `)${first}`, second && `-${second}`]
        .filter(Boolean)
        .join('');
    }
    return text;
  };

  // Função de registro
  const handleRegister = async () => {
    if (!nome || !telefone || !endereco || !cep || !numeroResidencia || !password) {
      Alert.alert('Erro', 'Preencha todos os campos obrigatórios!');
      return;
    }

    const emailMinusculo = email.toLowerCase();

    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, emailMinusculo, password);
      const userId = userCredential.user.uid;

      await setDoc(doc(db, 'Catador', userId), {
        nome,
        email: emailMinusculo,
        telefone,
        endereco,
        numeroResidencia,
        cep,
        materiais,
        cooperativa,
        registro,
      });

      Alert.alert('Sucesso!', 'Cadastro realizado com sucesso!');
      navigation.navigate('Home', { nome, email: emailMinusculo, telefone, endereco, numeroResidencia, cep });
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

  const toggleMaterial = (key) => {
    setMateriais({ ...materiais, [key]: !materiais[key] });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Cadastro de Catador</Text>

      <TextInput style={styles.input} placeholder="Nome Completo" value={nome} onChangeText={setNome} />
      <TextInput style={styles.input} placeholder="E-mail" value={email} onChangeText={(text) => setEmail(text.toLowerCase())} keyboardType="email-address" />
      <TextInput style={styles.input} placeholder="Telefone" value={telefone} onChangeText={(text) => setTelefone(formatarTelefone(text))} keyboardType="phone-pad" />
      <TextInput style={styles.input} placeholder="CEP" value={cep} onChangeText={setCep} keyboardType="numeric" />
      <TextInput style={styles.input} placeholder="Endereço" value={endereco} onChangeText={setEndereco} />
      <TextInput style={styles.input} placeholder="Número da residência" value={numeroResidencia} onChangeText={setNumeroResidencia} keyboardType="numeric" />

      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.passwordInput}
          placeholder="Senha"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          <MaterialCommunityIcons name={showPassword ? 'eye' : 'eye-off'} size={24} color="gray" />
        </TouchableOpacity>
      </View>

      <Text style={styles.subTitle}>Materiais que coleta:</Text>
      {Object.keys(materiais).map((item) => (
        <TouchableOpacity key={item} style={styles.checkboxContainer} onPress={() => toggleMaterial(item)}>
          <MaterialCommunityIcons
            name={materiais[item] ? 'checkbox-marked' : 'checkbox-blank-outline'}
            size={24}
            color="#15B392"
          />
          <Text style={styles.checkboxLabel}>{item.charAt(0).toUpperCase() + item.slice(1)}</Text>
        </TouchableOpacity>
      ))}

      <TextInput style={styles.input} placeholder="Nome da Cooperativa (se houver)" value={cooperativa} onChangeText={setCooperativa} />
      <TextInput style={styles.input} placeholder="Registro da Cooperativa (opcional)" value={registro} onChangeText={setRegistro} />

      <TouchableOpacity style={styles.button} onPress={handleRegister} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Cadastrar</Text>}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    backgroundColor: '#a8f9d2',
    padding: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#15B392',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 50,
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 15,
    marginVertical: 8,
    elevation: 3,
  },
  passwordContainer: {
    flexDirection: 'row',
    width: '100%',
    height: 50,
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 15,
    marginVertical: 8,
    elevation: 3,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  passwordInput: {
    flex: 1,
    height: '100%',
  },
  subTitle: {
    fontSize: 18,
    color: '#15B392',
    marginVertical: 10,
    alignSelf: 'flex-start',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
    alignSelf: 'flex-start',
  },
  checkboxLabel: {
    marginLeft: 10,
    fontSize: 16,
    color: '#333',
  },
  button: {
    backgroundColor: '#15B392',
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
