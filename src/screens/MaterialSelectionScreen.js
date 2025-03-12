import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native';

const MaterialSelectionScreen = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState('');
  const navigation = useNavigation();

  // Pontos de coleta próximos para cada material
  const pontosDeColeta = {
    'Plástico': { latitude: -23.55052, longitude: -46.633308 },
    'Papel': { latitude: -23.556522, longitude: -46.645308 },
    'Metal': { latitude: -23.560922, longitude: -46.638308 },
    'Vidro': { latitude: -23.545520, longitude: -46.635308 },
    'Óleo de cozinha': { latitude: -23.558000, longitude: -46.640500 },
    'Tóxicos': { latitude: -23.552000, longitude: -46.642800 }
  };

  // Quando o usuário escolhe um material
  const handleMaterialSelect = (material) => {
    setSelectedMaterial(material);
    setModalVisible(false);

    const local = pontosDeColeta[material];
    if (local) {
      navigation.navigate('Map', {
        latitude: local.latitude,
        longitude: local.longitude,
        materialSelecionado: material
      });
    }
  };

  return (
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

            {Object.keys(pontosDeColeta).map((material, index) => (
              <TouchableOpacity key={index} style={styles.materialButton} onPress={() => handleMaterialSelect(material)}>
                <Icon name={getIconName(material)} size={24} color="white" />
                <Text style={styles.materialText}>{material}</Text>
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
  );
};

// Função para retornar o ícone correspondente a cada material
const getIconName = (material) => {
  const icons = {
    'Plástico': 'recycle',
    'Papel': 'file-document-outline',
    'Metal': 'silverware-fork-knife',
    'Vidro': 'glass-fragile',
    'Óleo de cozinha': 'bottle-tonic',
    'Tóxicos': 'biohazard'
  };
  return icons[material] || 'help-circle-outline';
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E8F5E9', // Verde claro
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  button: {
    backgroundColor: '#63e6be',  // Verde escuro
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
