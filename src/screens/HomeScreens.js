import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { FontAwesome5 } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

const HomeScreen = ({ route }) => {
  const navigation = useNavigation();
  const { nome, email, tipo, avatar } = route.params || {};
  const [mostrarDados, setMostrarDados] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState(avatar); // para armazenar a foto selecionada
  const [loading, setLoading] = useState(false);

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

      <TouchableOpacity style={styles.button} onPress={() => setMostrarDados(!mostrarDados)}>
        <Text style={styles.buttonText}>Meus Dados</Text>
      </TouchableOpacity>

      {mostrarDados && (
        <View style={styles.dadosContainer}>
          <Text style={styles.dado}>Nome: {nome}</Text>
          <Text style={styles.dado}>Email: {email}</Text>
          <Text style={styles.dado}>Tipo: {tipo}</Text>
        </View>
      )}

      <View style={styles.content}>
        <View style={styles.summaryContainer}>
          <Text style={styles.summaryTitle}>Pontos de Coleta Próximos</Text>
          <Text style={styles.summaryItem}>Vidro: 3 pontos</Text>
          <Text style={styles.summaryItem}>Plástico: 5 pontos</Text>
          <Text style={styles.summaryItem}>Papel: 2 pontos</Text>
        </View>

        <View style={styles.statisticsContainer}>
          <Text style={styles.statisticsTitle}>Sua Contribuição</Text>
          <Text style={styles.statisticsItem}>Você já reciclou 10 kg de plástico!</Text>
        </View>
      </View>

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
          <Text style={styles.iconText}>Voltar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E8F5E9',
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
  button: {
    backgroundColor: '#7ff1ca',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#89f2cc',
    fontSize: 16,
  },
  dadosContainer: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
  content: {
    marginBottom: 20,
  },
  summaryContainer: {
    backgroundColor: '#5eeac2',
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
