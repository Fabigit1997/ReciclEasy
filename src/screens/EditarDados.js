import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { auth, db } from '../firebaseConfig';
import { doc, updateDoc } from 'firebase/firestore';

const EditarDados = ({ route }) => {
  const navigation = useNavigation();
  const { nome: routeNome, email: routeEmail, tipo: routeTipo } = route.params || {};

  const [nome, setNome] = useState(routeNome || '');
  const [email, setEmail] = useState(routeEmail || '');
  const [tipo, setTipo] = useState(routeTipo || '');

  const salvarAlteracoes = async () => {
    if (!nome || !tipo) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    try {
      const user = auth.currentUser;
      if (user) {
        const userRef = doc(db, 'usuarios', user.uid);
        await updateDoc(userRef, {
          nome,
          email,
          tipo,
        });

        Alert.alert('Sucesso', 'Dados atualizados com sucesso!');
        navigation.navigate('Home', { nome, email, tipo });
      }
    } catch (error) {
      Alert.alert('Erro', 'Erro ao salvar dados: ' + error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Nome:</Text>
      <TextInput style={styles.input} value={nome} onChangeText={setNome} />

      <Text style={styles.label}>Email:</Text>
      <TextInput style={styles.input} value={email} onChangeText={setEmail} keyboardType="email-address" />

      <Text style={styles.label}>Tipo (Catador ou Descartador):</Text>
      <TextInput style={styles.input} value={tipo} onChangeText={setTipo} />

      <TouchableOpacity style={styles.button} onPress={salvarAlteracoes}>
        <Text style={styles.buttonText}>Salvar Alterações</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E8F5E9',
    padding: 20,
  },
  label: {
    fontSize: 16,
    marginTop: 10,
  },
  input: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 5,
    marginTop: 5,
  },
  button: {
    backgroundColor: '#7ff1ca',
    padding: 12,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default EditarDados;
