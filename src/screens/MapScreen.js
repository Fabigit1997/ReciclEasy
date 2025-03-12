import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { useRoute } from '@react-navigation/native';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig';

const MapScreen = () => {
  const route = useRoute();
  const { material } = route.params || {};
  const [pontos, setPontos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPontosColeta = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "pontos_coleta"));
        const listaPontos = [];

        querySnapshot.forEach((doc) => {
          const data = doc.data();
          if (data.materiais.includes(material)) { // Filtra pelo material selecionado
            listaPontos.push({
              id: doc.id,
              ...data,
            });
          }
        });

        setPontos(listaPontos);
      } catch (error) {
        console.error("Erro ao buscar pontos de coleta:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPontosColeta();
  }, [material]);

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#63e6be" />
      ) : (
        <MapView style={styles.map} initialRegion={{
          latitude: pontos[0]?.latitude || -23.55052,
          longitude: pontos[0]?.longitude || -46.633308,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}>
          {pontos.map((ponto) => (
            <Marker
              key={ponto.id}
              coordinate={{ latitude: ponto.latitude, longitude: ponto.longitude }}
              title={ponto.nome}
              description={`Materiais aceitos: ${ponto.materiais.join(", ")}`}
            />
          ))}
        </MapView>
      )}
      <Text style={styles.texto}>Locais para descartar: {material}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  texto: {
    position: 'absolute',
    top: 20,
    left: 10,
    right: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    padding: 10,
    borderRadius: 8,
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default MapScreen;
