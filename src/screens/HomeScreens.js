import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, TextInput, ScrollView, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FontAwesome5 } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import app from '../src/config/firebase';

const HomeScreen = ({ navigation, route }) => {
  const db = getFirestore(app);
  const { userData } = route.params || {};
  const [selectedAvatar, setSelectedAvatar] = useState(null);
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [rua, setRua] = useState('');
  const [numeroResidencia, setNumeroResidencia] = useState('');
  const [cep, setCep] = useState('');
  const [dataSelecionada, setDataSelecionada] = useState('');
  const [compromisso, setCompromisso] = useState('');

  useEffect(() => {
    const carregarAvatar = async () => {
      const uri = await AsyncStorage.getItem('avatar');
      if (uri) {
        setSelectedAvatar(uri);
      }
    };

    const carregarDados = async () => {
      try {
        const dadosSalvos = await AsyncStorage.getItem('userData');
        if (dadosSalvos) {
          const dados = JSON.parse(dadosSalvos);
          setNome(dados.nome || '');
          setEmail(dados.email || '');
          setTelefone(dados.telefone || '');
          setRua(dados.rua || '');
          setNumeroResidencia(dados.numeroResidencia || '');
          setCep(dados.cep || '');
        }
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      }
    };

    carregarAvatar();
    carregarDados();
  }, []);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setSelectedAvatar(uri);
      await AsyncStorage.setItem('avatar', uri);
    }
  };

  const salvarAgenda = async () => {
    if (!dataSelecionada || !compromisso) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos da agenda.');
      return;
    }

    try {
      await addDoc(collection(db, 'agenda'), {
        nome,
        data: dataSelecionada,
        compromisso,
      });
      Alert.alert('Sucesso', 'Compromisso salvo com sucesso!');
      setDataSelecionada('');
      setCompromisso('');
    } catch (error) {
      console.error('Erro ao salvar compromisso:', error);
      Alert.alert('Erro', 'Não foi possível salvar o compromisso.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={pickImage} style={styles.avatarContainer}>
          {selectedAvatar ? (
            <Image source={{ uri: selectedAvatar }} style={styles.avatar} />
          ) : (
            <Text style={styles.avatarText}>Selecionar Avatar</Text>
          )}
        </TouchableOpacity>
        <Text style={styles.greeting}>Olá, {nome || 'usuário'}!</Text>
      </View>

      <View style={styles.dadosContainer}>
        <Text style={styles.dadosTitulo}>Seus dados:</Text>
        <View style={styles.camposDados}>
          <Text style={styles.dado}>Nome: {nome}</Text>
          <Text style={styles.dado}>Email: {email || 'Não informado'}</Text>
          <Text style={styles.dado}>Telefone: {telefone}</Text>
          <Text style={styles.dado}>Endereço: {rua}, {numeroResidencia}</Text>
          <Text style={styles.dado}>CEP: {cep}</Text>
        </View>
      </View>

      <View style={styles.agendaContainer}>
        <Text style={styles.dadosTitulo}>Agende um compromisso:</Text>
        <TextInput
          style={styles.inputCompromisso}
          placeholder="Data (dd/mm/aaaa)"
          value={dataSelecionada}
          onChangeText={setDataSelecionada}
        />
        <TextInput
          style={styles.inputCompromisso}
          placeholder="Compromisso"
          value={compromisso}
          onChangeText={setCompromisso}
        />
        <TouchableOpacity style={styles.botaoHorario} onPress={salvarAgenda}>
          <Text style={styles.botaoTexto}>Salvar Compromisso</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.iconButton} onPress={() => navigation.navigate('MaterialSelection')}>
          <FontAwesome5 name="recycle" size={24} color="green" />
          <Text style={styles.iconText}>Descartar</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.iconButton} onPress={() => navigation.navigate('Education')}>
          <FontAwesome5 name="lightbulb" size={24} color="orange" />
          <Text style={styles.iconText}>Você sabia?</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.iconButton} onPress={() => navigation.navigate('Splash')}>
          <FontAwesome5 name="arrow-left" size={24} color="red" />
          <Text style={styles.iconText}>Voltar</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  avatarText: {
    color: '#333',
  },
  greeting: {
    fontSize: 18,
    marginTop: 10,
  },
  dadosContainer: {
    marginVertical: 10,
  },
  dadosTitulo: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  camposDados: {
    marginTop: 8,
    paddingLeft: 10,
  },
  dado: {
    fontSize: 14,
    color: '#555',
  },
  agendaContainer: {
    marginTop: 20,
  },
  inputCompromisso: {
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  botaoHorario: {
    backgroundColor: '#333',
    padding: 10,
    marginTop: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  botaoTexto: {
    color: '#fff',
    fontWeight: 'bold',
  },
  footer: {
    marginTop: 30,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  iconButton: {
    alignItems: 'center',
  },
  iconText: {
    marginTop: 5,
    fontSize: 12,
  },
});
