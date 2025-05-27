import React, { useEffect, useState, useRef } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { collection, getDocs } from 'firebase/firestore';
import { useRoute } from '@react-navigation/native';
import { db } from '../firebaseConfig';
import catadorIcon from '../assets/catador.png';
import pontoIcon from '../assets/ponto.png';

export default function MapaScreen() {
  const route = useRoute();
  const mapRef = useRef(null);

  const [pontos, setPontos] = useState([]);

  const { latitude, longitude, material } = route.params || {};

  useEffect(() => {
    async function carregarPontos() {
      try {
        const pontosColetaRef = collection(db, 'pontos_coleta');
        const catadoresRef = collection(db, 'Catador');

        const [pontosSnapshot, catadoresSnapshot] = await Promise.all([
          getDocs(pontosColetaRef),
          getDocs(catadoresRef),
        ]);

        const pontosColeta = pontosSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          tipo: 'Ponto de Coleta'
        }));

        const catadores = catadoresSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          tipo: 'Catador'
        }));

        setPontos([...pontosColeta, ...catadores]);
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
      }
    }

    carregarPontos();
  }, []);

  useEffect(() => {
  if (mapRef.current && material) {
    const catadoresFiltrados = pontos.filter(p => 
      p.tipo === 'Catador' &&
      p.tipoMateriais &&
      p.tipoMateriais.toLowerCase().includes(material.toLowerCase())
    );

    if (catadoresFiltrados.length > 0) {
      const avgLat = catadoresFiltrados.reduce((sum, p) => sum + parseFloat(p.latitude), 0) / catadoresFiltrados.length;
      const avgLng = catadoresFiltrados.reduce((sum, p) => sum + parseFloat(p.longitude), 0) / catadoresFiltrados.length;

      mapRef.current.animateToRegion({
        latitude: avgLat,
        longitude: avgLng,
        latitudeDelta: 0.03,
        longitudeDelta: 0.03,
      }, 1000);
    } else {
      console.warn('Nenhum catador encontrado para o material selecionado:', material);
    }
  } else if (latitude && longitude && mapRef.current) {
    mapRef.current.animateToRegion({
      latitude,
      longitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    }, 1000);
  }
}, [pontos, material]);


  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.mapa}
        initialRegion={{
          latitude: -23.55052,
          longitude: -46.633308,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
      >
        {pontos.map((ponto) => {
          const lat = Number(ponto.latitude);
          const lng = Number(ponto.longitude);

          if (!lat || !lng || isNaN(lat) || isNaN(lng)) {
            console.warn('Coordenadas inválidas ignoradas:', ponto);
            return null;
          }

          return (
            <Marker
              key={ponto.id}
              coordinate={{ latitude: lat, longitude: lng }}
              title={ponto.nome || 'Sem nome'}
              description={`${ponto.tipo} - ${ponto.materiais || ponto.tipoMateriais}`}
              image={ponto.tipo === 'Catador' ? catadorIcon : pontoIcon}
            />
          );
        })}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  mapa: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
});
