import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';

const MapScreen = () => {
  const [location, setLocation] = useState(null);
  const [region, setRegion] = useState(null);

  // Lista de pontos de coleta fixos
  const recyclingPoints = [
    { id: 1, latitude: -23.55052, longitude: -46.633308, title: "Ponto A", description: "Coleta de plástico e vidro" },
    { id: 2, latitude: -23.55652, longitude: -46.637308, title: "Ponto B", description: "Coleta de papel e metal" },
    { id: 3, latitude: -23.55852, longitude: -46.640308, title: "Ponto C", description: "Coleta de óleo de cozinha" },
  ];

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permissão negada', 'O app precisa de acesso à localização para funcionar.');
        return;
      }

      let userLocation = await Location.getCurrentPositionAsync({});
      setLocation(userLocation.coords);

      setRegion({
        latitude: userLocation.coords.latitude,
        longitude: userLocation.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    })();
  }, []);

  return (
    <View style={styles.container}>
      {region ? (
        <MapView
          style={styles.map}
          region={region}
          showsUserLocation={true}
          followsUserLocation={true}
        >
          {/* Adicionando os pontos de coleta no mapa */}
          {recyclingPoints.map((point) => (
            <Marker
              key={point.id}
              coordinate={{ latitude: point.latitude, longitude: point.longitude }}
              title={point.title}
              description={point.description}
            />
          ))}
        </MapView>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
});

export default MapScreen;
