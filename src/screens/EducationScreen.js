import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';  // FontAwesome5 para os ícones

const EducationScreen = () => {
  const showMaterialInfo = (material) => {
    Alert.alert(`Informações sobre ${material}`, `Aqui estão as dicas sobre o material ${material}`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Você Sabia?</Text>
      
      <View style={styles.materialButtonsContainer}>
        {/* Botões de materiais recicláveis com ícones */}
        <TouchableOpacity style={[styles.materialButton, { backgroundColor: 'green' }]} onPress={() => showMaterialInfo('Plástico')}>
          <FontAwesome5 name="recycle" size={30} color="white" />
          <Text style={styles.materialText}>Plástico</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={[styles.materialButton, { backgroundColor: 'blue' }]} onPress={() => showMaterialInfo('Vidro')}>
          <FontAwesome5 name="glass-martini" size={30} color="white" />
          <Text style={styles.materialText}>Vidro</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.materialButton, { backgroundColor: 'yellow' }]} onPress={() => showMaterialInfo('Papel')}>
          <FontAwesome5 name="newspaper" size={30} color="white" />
          <Text style={styles.materialText}>Papel</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.materialButton, { backgroundColor: 'brown' }]} onPress={() => showMaterialInfo('Orgânico')}>
          <FontAwesome5 name="leaf" size={30} color="white" />
          <Text style={styles.materialText}>Orgânico</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  materialButtonsContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
  },
  materialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    padding: 15,
    borderRadius: 10,
    width: '80%',
    justifyContent: 'center',
  },
  materialText: {
    fontSize: 18,
    marginLeft: 10,
    color: 'white',
  },
});

export default EducationScreen;
