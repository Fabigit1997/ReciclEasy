import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { FontAwesome5 } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

const HomeScreen = ({ route }) => {
  const navigation = useNavigation();
  const { nome, email, telefone, avatar, rua, numeroResidencia, cep } = route.params || {};
  const [mostrarDados, setMostrarDados] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState(avatar); // para armazenar a foto selecionada

  // Função para selecionar a imagem
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedAvatar(result.assets[0].uri);
    }
  };

  return (
    
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.avatarContainer} onPress={pickImage}>
          {selectedAvatar ? (
            <Image source={{ uri: selectedAvatar }} style={styles.avatar} />
          ) : (
            <Text style={styles.avatarText}>Selecionar Foto</Text>
          )}
        </TouchableOpacity>
        <Text style={styles.greeting}>Olá, {nome || 'Usuário'}!</Text>
      </View>
       
      <View style={styles.dadosContainer}>
        <TouchableOpacity onPress={() => setMostrarDados(!mostrarDados)}>
          <Text style={styles.dadosTitulo}>Dados Pessoais</Text>
        </TouchableOpacity>

        {mostrarDados && (
          <View style={styles.camposDados}>
            <Text style={styles.dado}>Nome: {nome || ' '}</Text>
            <Text style={styles.dado}>Email: {email || ' '}</Text>
            <Text style={styles.dado}>Telefone: {telefone || ' '}</Text>
            <Text style={styles.dado}>Rua: {rua|| ' '}</Text>
            <Text style={styles.dado}>Número: {numeroResidencia || ' '}</Text>
            <Text style={styles.dado}>CEP: {cep || ' '}</Text>
          </View>
        )}
      </View>

      

      {/* Rodapé com os ícones de navegação */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.iconButton} onPress={() => navigation.navigate('MaterialSelection')}>
          <FontAwesome5 name="recycle" size={24} color="green" />
          <Text style={styles.iconText}>Descartar</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.iconButton} onPress={() => navigation.navigate('Education')}>
          <FontAwesome5 name="lightbulb" size={24} color="orange" />
          <Text style={styles.iconText}>Você Sabia?</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.iconButton} onPress={() => navigation.navigate('Splash')}>
          <FontAwesome5 name="arrow-left" size={24} color="red" />
          <Text style={styles.iconText}>Sair</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#a8f9d2',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  avatarContainer: {
    width: 65,
    height: 65,
    borderRadius: 30,
    backgroundColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  avatar: {
    width: 65,
    height: 65,
    borderRadius: 30,
  },
  avatarText: {
    fontSize: 12,
    color: '#666',
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  dadosContainer: {
    backgroundColor: '#7ff1ca',
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
  dadosTitulo: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#fff',
  },
  camposDados: {
    marginTop: 10,
  },
  dado: {
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
  },
  content: {
    marginBottom: 20,
  },
  summaryContainer: {
    backgroundColor: '#00FF9C',
    padding: 15,
    borderRadius: 5,
    marginBottom: 15,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  summaryItem: {
    fontSize: 16,
    marginVertical: 5,
  },
  statisticsContainer: {
    backgroundColor: '#7ff1ca',
    padding: 15,
    borderRadius: 5,
    marginBottom: 15,
  },
  statisticsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  statisticsItem: {
    fontSize: 16,
    marginVertical: 5,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    position: 'absolute',
    bottom: 20,
    width: '100%',
  },
  iconButton: {
    alignItems: 'center',
  },
  iconText: {
    fontSize: 14,
  },
});

export default HomeScreen;
