import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import Geocoder from 'react-native-geocoding';
import Checkbox from 'expo-checkbox';
import { db } from '../firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';

// Configure sua chave da API do Google Maps
Geocoder.init('AIzaSyCUArq8W1NLKOI7_7ST6BFcYFj95S0JAfs');

export default function RegisterCollectorScreen({ navigation }) {
  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [email, setEmail] = useState('');
  const [endereco, setEndereco] = useState('');
  const [materiais, setMateriais] = useState({
    papel: false,
    plastico: false,
    vidro: false,
    metal: false,
    organico: false,
  });

  const handleCadastro = async () => {
    if (!nome || !telefone || !endereco) {
      Alert.alert('Erro', 'Preencha todos os campos obrigatórios.');
      return;
    }

    try {
      const geo = await Geocoder.from(endereco);
      const location = geo.results[0].geometry.location;

      await addDoc(collection(db, 'Catador'), {
        nome,
        telefone,
        email,
        endereco,
        latitude: location.lat,
        longitude: location.lng,
        materiais,
      });

      Alert.alert('Sucesso', 'Catador cadastrado com sucesso!');
      navigation.goBack();
    } catch (error) {
      console.error('Erro ao cadastrar catador:', error);
      Alert.alert('Erro', 'Não foi possível cadastrar. Verifique o endereço ou tente novamente.');
    }
  };

  const toggleMaterial = (key) => {
    setMateriais((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.titulo}>Cadastro de Catador</Text>

      <TextInput
        placeholder="Nome completo"
        value={nome}
        onChangeText={setNome}
        style={styles.input}
      />
      <TextInput
        placeholder="Telefone"
        keyboardType="phone-pad"
        value={telefone}
        onChangeText={setTelefone}
        style={styles.input}
      />
      <TextInput
        placeholder="E-mail (opcional)"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
      />
      <TextInput
        placeholder="Endereço completo"
        value={endereco}
        onChangeText={setEndereco}
        style={styles.input}
      />

      <Text style={styles.subtitulo}>Tipos de materiais que coleta:</Text>
      {Object.keys(materiais).map((material) => (
        <View key={material} style={styles.checkboxContainer}>
          <Checkbox
            value={materiais[material]}
            onValueChange={() => toggleMaterial(material)}
          />
          <Text style={styles.checkboxLabel}>{material}</Text>
        </View>
      ))}

      <TouchableOpacity style={styles.botao} onPress={handleCadastro}>
        <Text style={styles.botaoTexto}>Cadastrar</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#3c3c3c',
    textAlign: 'center',
  },
  subtitulo: {
    fontSize: 18,
    marginTop: 20,
    marginBottom: 10,
    fontWeight: '600',
    color: '#444',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  checkboxLabel: {
    marginLeft: 8,
    fontSize: 16,
  },
  botao: {
    backgroundColor: '#0a8754',
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
  },
  botaoTexto: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
});
