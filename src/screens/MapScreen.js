import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const MapScreen = ({ route }) => {
  const { latitude, longitude, material } = route.params;

  const getIconName = (material) => {
    const icons = {
      'Plástico': 'recycle',
      'Papelão': 'file-document-outline',
      'Metal': 'silverware-fork-knife',
      'Vidro': 'glass-fragile',
      'Óleo de cozinha': 'bottle-tonic',
      'Doação de Roupa': 'tshirt-crew',
      'Doação de Livros': 'book-open-page-variant',
      'Entulho': 'dump-truck',
      'Componentes Eletrônicos': 'biohazard',
    };
    return icons[material] || 'map-marker';
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ponto de coleta para: {material}</Text>

      <MapView
        style={styles.map}
        initialRegion={{
          latitude: latitude,
          longitude: longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
      >
        <Marker
          coordinate={{ latitude: latitude, longitude: longitude }}
          title={`Coleta de ${material}`}
          description={`Ponto de coleta para ${material}`}
        >
          <Icon name={getIconName(material)} size={30} color="#28c7a3" />
        </Marker>
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    padding: 15,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    backgroundColor: '#63e6be',
    color: '#fff',
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height - 60,
  },
});

export default MapScreen;
