import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Image } from 'react-native';

const materials = [
  { name: 'Plástico', color: 'red', image: require('../assets/lixeira-plastico.png.png') },
  { name: 'Papel', color: 'blue', image: require('../assets/lixeira-papel.png.png') },
  { name: 'Metal', color: 'yellow', image: require('../assets/lixeira-metal.png.png') },
  { name: 'Metal', color: 'green', image: require('../assets/lixeira-vidro.png.png') },
  { name: 'Metal', color: 'orange', image: require('../assets/lixeira-toxico.png.png') },
 
];
 

const EducationScreen = () => {
  const showMaterialInfo = (material) => {
    Alert.alert(`Informações sobre ${material}`, `Aqui estão as dicas sobre o material ${material}`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Você Sabia?</Text>
      
      <View style={styles.lixeiraContainer}>
        {materials.map((item, index) => (
          <TouchableOpacity 
            key={index} 
            style={[styles.lixeiraButton, { backgroundColor: item.color }]} 
            onPress={() => showMaterialInfo(item.name)}
          >
            <Image source={item.image} style={styles.lixeiraImage} />
          </TouchableOpacity>
        ))}
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
  lixeiraContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  lixeiraButton: {
    margin: 10,
    padding: 10,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lixeiraImage: {
    width: 80,
    height: 100,
    resizeMode: 'contain',
  },
});

export default EducationScreen;
