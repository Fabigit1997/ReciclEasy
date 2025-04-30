import React from 'react';
import {View,Text,TouchableOpacity,StyleSheet,Alert,Image,ScrollView,Linking,} from 'react-native';
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';

const materials = [
  {
    name: 'Plástico',
    color: 'red',
    image: require('../assets/lixeira-plastico.png.png'),
    info: {
      pode: 'Garrafas PET, tampas, potes de shampoo, sacolas plásticas limpas.',
      naoPode: 'Embalagens engorduradas, plásticos sujos, isopor sujo.',
    },
  },
  {
    name: 'Papel',
    color: 'blue',
    image: require('../assets/lixeira-papel.png.png'),
    info: {
      pode: 'Jornais, caixas de papelão, folhas de caderno, papel sulfite.',
      naoPode: 'Papel higiênico, papel plastificado, papel carbono, papéis engordurados.',
    },
  },
  {
    name: 'Metal',
    color: 'yellow',
    image: require('../assets/lixeira-metal.png.png'),
    info: {
      pode: 'Latas de alumínio, tampinhas, pregos, parafusos.',
      naoPode: 'Latas de tinta com resíduos, latas de aerossol com produto dentro.',
    },
  },
  {
    name: 'Vidro',
    color: 'green',
    image: require('../assets/lixeira-vidro.png.png'),
    info: {
      pode: 'Garrafas, potes de alimentos, copos de vidro.',
      naoPode: 'Espelhos, vidros planos, cerâmica, porcelana.',
    },
  },
  {
    name: 'Tóxico',
    color: 'orange',
    image: require('../assets/lixeira-toxico.png.png'),
    info: {
      pode: 'Pilhas, baterias, remédios vencidos (em locais apropriados).',
      naoPode: 'Descartar no lixo comum ou no esgoto.',
    },
  },
];

const reuseTips = [
  { text: '🧴 Transforme garrafas PET em vasos de plantas.' },
  { text: '📦 Use caixas de papelão para organizar objetos.' },
  { text: '🥫 Latas de alumínio podem virar porta-canetas.' },
  { text: '🍾 Potes de vidro são ótimos para armazenar temperos.' },
  { text: '🛍️ Sacolas plásticas limpas podem ser reutilizadas para o lixo.' },
];

const EducationScreen = () => {
  const showMaterialInfo = (material) => {
    Alert.alert(
      `Informações sobre ${material.name}`,
      `♻️ Pode reciclar:\n${material.info.pode}\n\n🚫 Não pode reciclar:\n${material.info.naoPode}`
    );
  };

  const openLink = (url) => {
    Linking.openURL(url);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      
      <View style={styles.greenBox}>
  <Text style={styles.title}>O que pode e o que não pode reciclar!</Text>

  <View style={styles.lixeiraContainer}>
    {materials.map((item, index) => (
      <TouchableOpacity
        key={index}
        style={[styles.lixeiraButton, { backgroundColor: item.color }]}
        onPress={() => showMaterialInfo(item)}
      >
        <Image source={item.image} style={styles.lixeiraImage} />
      </TouchableOpacity>
    ))}
  </View>


        <View style={styles.tipsBox}>
          <Text style={styles.tipsTitle}>💡 Dicas de reutilização:</Text>
          {reuseTips.map((tip, index) => (
            <Text key={index} style={styles.tipText}>{tip.text}</Text>
          ))}
        </View>
        <TouchableOpacity
  style={styles.warningButton}
  onPress={() => Alert.alert(
    "Atenção",
    "⚠️ Materiais cortantes como vidro quebrado devem ser embrulhados em papel grosso ou jornal, identificados e descartados com cuidado para evitar acidentes."
  )}
>
  <Text style={styles.warningButtonText}>⚠️ Atenção</Text>
</TouchableOpacity>

              
        

        <View style={styles.linksBox}>
          <Text style={styles.tipsTitle}>🌐 Links úteis:</Text>

          <TouchableOpacity style={styles.linkButton1} onPress={() => openLink('https://www.gov.br/meioambiente')}>
            <Text style={styles.linkText}>🌍 Visite uma página sobre Meio Ambiente</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.linkButton2} onPress={() => openLink('https://www.ecycle.com.br')}>
            <Text style={styles.linkText}>💡 Veja mais dicas de reutilização</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.linkButton3} onPress={() => openLink('https://www.pinterest.com/search/pins/?q=brinquedos%20reciclados')}>
            <Text style={styles.linkText}>👶 Ideias para desenvolvimento infantil com recicláveis</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 30,
    alignItems: 'center',
    backgroundColor: '#a8f9d2',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#00FF9C',
    marginBottom: 14,
    textAlign: 'center',
  },
  greenBox: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 30,
    width: '90%',
    alignItems: 'center',
  },
  lixeiraContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'nowrap',
    marginBottom: 20,
  },
  lixeiraButton: {
    marginHorizontal: 6,
    padding: 5,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lixeiraImage: {
    width: 50,
    height: 60,
    resizeMode: 'contain',
  },
  tipsBox: {
    backgroundColor: 'rgba(0, 255, 0, 0.05)',
    borderRadius: 12,
    padding: 12,
    width: '100%',
    marginBottom: 15,
  },
  tipsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000FF9C',
    marginBottom: 10,
    textAlign: 'center',
  },
  tipText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 6,
  },
  warningText: {
    marginTop: 16,
    backgroundColor: '#fff3cd',
    borderLeftWidth: 5,
    borderLeftColor: '#ffcc00',
    padding: 10,
    borderRadius: 8,
    color: '#856404',
    fontSize: 14,
  },
  linksBox: {
    backgroundColor: 'rgba(0, 128, 0, 0.08)',
    padding: 12,
    borderRadius: 12,
    width: '100%',
    marginTop: 16,
    alignItems: 'center',
  },
  linkButton1: {
    backgroundColor: '#00FF9C',
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
    width: '100%',
  },
  linkButton2: {
    backgroundColor: '#73EC8B',
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
    width: '100%',
  },
  linkButton3: {
    backgroundColor: '#B6FFA1',
    padding: 12,
    borderRadius: 10,
    width: '100%',
  },
  linkText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default EducationScreen;
