import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, ImageBackground } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';

const MaterialSelectionScreen = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState('');
  const navigation = useNavigation();

  const pontos_coleta = {
    'Plástico': { latitude: -23.55052, longitude: -46.633308 },
    'Papelão': { latitude: -23.556522, longitude: -46.645308 },
    'Metal': { latitude: -23.560922, longitude: -46.638308 },
    'Vidro': { latitude: -23.545520, longitude: -46.635308 },
    'Componentes_Eletrônicos': { latitude: -23.552000, longitude: -46.642800 },
    'Entulho': { latitude: -23.559500, longitude: -46.650500 },
    'Óleo de cozinha': { latitude: -23.558000, longitude: -46.640500 },
    'Doação de Roupa': { latitude: -23.554000, longitude: -46.646800 },
    'Doação de Livros': { latitude: -23.557000, longitude: -46.649000 },
  };

  const handleMaterialSelect = (materiais) => {
    setSelectedMaterial(materiais);
    setModalVisible(false);

    const local = pontos_coleta[materiais];
    if (local) {
      navigation.navigate('Map', {
        latitude: local.latitude,
        longitude: local.longitude,
        material: materiais
      });
    }
  };

  return (
    <ImageBackground 
      source={require('../assets/TelaSeleçãoMaterial.png')}
      style={styles.backgroundImage}
    >
      <View style={styles.container}>
        <TouchableOpacity style={styles.button} onPress={() => setModalVisible(true)}>
          <Text style={styles.buttonText}>Selecione o Material</Text>
        </TouchableOpacity>

        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Escolha um Material:</Text>

              {Object.keys(pontos_coleta).map((materiais, index) => (
                <TouchableOpacity key={index} style={styles.materialButton} onPress={() => handleMaterialSelect(materiais)}>
                  <Icon name={getIconName(materiais)} size={24} color="white" />
                  <Text style={styles.materialText}>{materiais}</Text>
                </TouchableOpacity>
              ))}

              <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
                <Text style={styles.closeText}>Fechar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {selectedMaterial ? <Text style={styles.selectedMaterialText}>Você escolheu: {selectedMaterial}</Text> : null}
      </View>
    </ImageBackground>
  );
};

const getIconName = (materiais) => {
  const icons = {
    'Plástico': 'recycle',
    'Papelão': 'file-document-outline',
    'Metal': 'silverware-fork-knife',
    'Vidro': 'glass-fragile',
    'Óleo de cozinha': 'bottle-tonic',
    'Doação de Roupa': 'tshirt-crew',
    'Doação de Livros': 'book-open-page-variant',
    'Entulho': 'dump-truck',
    'Componentes_Eletrônicos': 'biohazard',
  };
  return icons[materiais] || 'help-circle-outline';
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  button: {
    backgroundColor: '#63e6be',
    paddingVertical: 12,
    paddingHorizontal: 80,
    borderRadius: 10,
    marginBottom: 20,
    elevation: 3,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#63e6be',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    marginBottom: 15,
    fontWeight: 'bold',
    color: 'white',
  },
  materialButton: {
    backgroundColor: '#28c7a3',
    paddingVertical: 12,
    marginBottom: 10,
    borderRadius: 5,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    width: '100%',
  },
  materialText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  closeButton: {
    backgroundColor: 'white',
    paddingVertical: 12,
    marginTop: 15,
    borderRadius: 5,
    alignItems: 'center',
    width: '100%',
  },
  closeText: {
    fontSize: 18,
    color: '#f44336',
    fontWeight: 'bold',
  },
  selectedMaterialText: {
    fontSize: 18,
    marginTop: 20,
    fontWeight: 'bold',
    color: '#333',
  },
});

export default MaterialSelectionScreen;
