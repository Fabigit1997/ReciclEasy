import React, { useState } from 'react';
import { View, Text, Button, TouchableOpacity, Modal, StyleSheet } from 'react-native';

const MaterialSelectionScreen = ({ navigation }) => {
  // Estado para controlar a exibição do modal
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState('');

  // Função para abrir o modal e selecionar o material
  const handleMaterialSelect = (material) => {
    setSelectedMaterial(material);  // Define o material selecionado
    setModalVisible(false);  // Fecha o modal após a seleção
    navigation.navigate('Map', { material });  // Navega para a tela do mapa com o material selecionado
  };

  return (
    <View style={styles.container}>
    
      
      {/* Botão que abre o modal */}
      <TouchableOpacity style={styles.button} onPress={() => setModalVisible(true)}>
        <Text style={styles.buttonText}>Selecione o Material</Text>
      </TouchableOpacity>
      
      {/* Modal com a lista de materiais */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Escolha um Material:</Text>
            <TouchableOpacity style={styles.materialButton} onPress={() => handleMaterialSelect('Plástico')}>
              <Text style={styles.materialText}>Plástico</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.materialButton} onPress={() => handleMaterialSelect('Papel')}>
              <Text style={styles.materialText}>Papel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.materialButton} onPress={() => handleMaterialSelect('Metal')}>
              <Text style={styles.materialText}>Metal</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.materialButton} onPress={() => handleMaterialSelect('Vidro')}>
              <Text style={styles.materialText}>Vidro</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.materialButton} onPress={() => handleMaterialSelect('Oléo de cozinha')}>
              <Text style={styles.materialText}>Oléo de cozinha</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.materialButton} onPress={() => handleMaterialSelect('Tóxicos')}>
              <Text style={styles.materialText}>Tóxicos</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.closeText}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Exibindo material selecionado */}
      {selectedMaterial ? <Text style={styles.selectedMaterialText}>Você escolheu: {selectedMaterial}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#528c59', // Cor verde claro para o fundo
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#4CAF50',  // Cor verde para o botão
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 5,
    marginBottom: 20,
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
    backgroundColor: 'rgba(0, 0, 0, 0.5)',  // Fundo escuro semitransparente
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  modalTitle: {
    fontSize: 20,
    marginBottom: 15,
    fontWeight: 'bold',
  },
  materialButton: {
    backgroundColor: '#f0f0f0', // Cor de fundo branco para cada opção
    paddingVertical: 12,
    marginBottom: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  materialText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    backgroundColor: '#f44336', // Cor vermelha para o botão de fechar
    paddingVertical: 12,
    marginTop: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  closeText: {
    fontSize: 18,
    color: 'white',
    fontWeight: 'bold',
  },
  selectedMaterialText: {
    fontSize: 18,
    marginTop: 20,
    fontWeight: 'bold',
  },
});

export default MaterialSelectionScreen;
