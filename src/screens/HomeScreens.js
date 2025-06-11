import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, TextInput, ScrollView, Platform, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { FontAwesome5 } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { Calendar } from 'react-native-calendars';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import DateTimePicker from '@react-native-community/datetimepicker';
import { db } from '../firebaseConfig'; // ajuste o caminho conforme seu projeto
import { collection, addDoc } from 'firebase/firestore';


const HomeScreen = ({ route }) => {
  const navigation = useNavigation();
  const { nome, email, telefone, avatar, rua, numeroResidencia, cep } = route.params || {};
  const [mostrarDados, setMostrarDados] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState(avatar);
  const [selectedDate, setSelectedDate] = useState('');
  const [novoCompromisso, setNovoCompromisso] = useState('');
  const [agenda, setAgenda] = useState({});

  // Estado para controle do horário
  const [time, setTime] = useState(new Date()); // hora atual por padrão
  const [showPicker, setShowPicker] = useState(false);

  // Permissões de notificação
  useEffect(() => {
    const solicitarPermissao = async () => {
      if (Device.isDevice) {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== 'granted') {
          const { status } = await Notifications.requestPermissionsAsync();
          finalStatus = status;
        }
        if (finalStatus !== 'granted') {
          alert('Permissão para notificações foi negada!');
        }
      } else {
        alert('Use um dispositivo físico para ver notificações.');
      }
    };
    solicitarPermissao();
  }, []);

  // Selecionar imagem
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
    if (!result.canceled) {
      setSelectedAvatar(result.assets[0].uri);
    }
  };

  // Formatar horário para HH:MM
  const formatTime = (date) => {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  // Validar horário - não aceita 00:00
  const validarHorario = (date) => {
    const hora = date.getHours();
    const minuto = date.getMinutes();
    if (hora === 0 && minuto === 0) return false;
    return true;
  };

  const onTimeChange = (event, selectedTime) => {
    setShowPicker(false);
    if (selectedTime) {
      setTime(selectedTime);
    }
  };

  // Adicionar compromisso com notificação
  const adicionarCompromisso = async () => {
    if (!novoCompromisso || !selectedDate) {
      Alert.alert('Erro', 'Por favor, selecione data e insira um compromisso.');
      return;
    }
    if (!validarHorario(time)) {
      Alert.alert('Erro', 'Por favor, selecione um horário diferente de 00:00.');
      return;
    }

    const novaLista = [...(agenda[selectedDate] || []), `${novoCompromisso} às ${formatTime(time)}`];
    const novaAgenda = { ...agenda, [selectedDate]: novaLista };
    setAgenda(novaAgenda);
    setNovoCompromisso('');

    // Agendar notificação 1h antes do horário selecionado
    const [hour, minute] = [time.getHours(), time.getMinutes()];
    const dataCompromisso = new Date(`${selectedDate}T${hour.toString().padStart(2,'0')}:${minute.toString().padStart(2,'0')}:00`);
    const horarioNotificacao = new Date(dataCompromisso.getTime() - 60 * 60 * 1000); // 1 hora antes

    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Lembrete de compromisso',
          body: `${novoCompromisso} às ${formatTime(time)}`,
          sound: true,
        },
        trigger: horarioNotificacao > new Date() ? horarioNotificacao : null,
      });

      await addDoc(collection(db, 'agenda'), {
        nome,
        data: selectedDate,
        compromisso: novoCompromisso,
        horario: formatTime(time),
      });
    } catch (error) {
      console.error('Erro ao salvar no Firestore ou agendar notificação:', error);
    }
  };

  // Cancelar compromisso (limpar campos)
  const cancelarCompromisso = () => {
    setNovoCompromisso('');
    setSelectedDate('');
    setTime(new Date());
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.avatarContainer} onPress={pickImage}>
          {selectedAvatar ? (
            <Image source={{ uri: selectedAvatar }} style={styles.avatar} />
          ) : (
            <Text style={styles.avatarText}>Selecionar Foto</Text>
          )}
        </TouchableOpacity>
        <Text style={styles.greeting}>Olá, {nome || 'Usuário'}!</Text>
      </View>

      <View style={styles.dadosContainer}>
        <TouchableOpacity onPress={() => setMostrarDados(!mostrarDados)}>
          <Text style={styles.dadosTitulo}>Dados Pessoais</Text>
        </TouchableOpacity>
        {mostrarDados && (
          <View style={styles.camposDados}>
            <Text style={styles.dado}>Nome: {nome || ' '}</Text>
            <Text style={styles.dado}>Email: {email || ' '}</Text>
            <Text style={styles.dado}>Telefone: {telefone || ' '}</Text>
            <Text style={styles.dado}>Rua: {rua || ' '}</Text>
            <Text style={styles.dado}>Número: {numeroResidencia || ' '}</Text>
            <Text style={styles.dado}>CEP: {cep || ' '}</Text>
          </View>
        )}
      </View>

      {/* Calendário e Agenda */}
      <View style={styles.agendaContainer}>
        <Text style={styles.dadosTitulo}>Agenda</Text>
        <Calendar
          onDayPress={day => setSelectedDate(day.dateString)}
          markedDates={{
            [selectedDate]: { selected: true, marked: true, selectedColor: '#00FF9C' },
          }}
        />
        {selectedDate !== '' && (
          <View>
            <Text style={{ fontWeight: 'bold', marginTop: 10 }}>
              Compromissos em {selectedDate}:
            </Text>
            {(agenda[selectedDate] || []).map((item, index) => (
              <Text key={index}>- {item}</Text>
            ))}
          </View>
        )}

        <TextInput
          placeholder="Novo compromisso"
          value={novoCompromisso}
          onChangeText={setNovoCompromisso}
          style={styles.inputCompromisso}
        />

        <TouchableOpacity onPress={() => setShowPicker(true)} style={styles.botaoHorario}>
          <Text style={{ color: '#fff' }}>Selecionar Horário: {formatTime(time)}</Text>
        </TouchableOpacity>

        {showPicker && (
          <DateTimePicker
            value={time}
            mode="time"
            is24Hour={true}
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={onTimeChange}
          />
        )}

        <View style={styles.botoesRow}>
          <TouchableOpacity onPress={adicionarCompromisso} style={[styles.botao, { backgroundColor: '#00FF9C' }]}>
            <Text style={styles.botaoTexto}>Adicionar</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={cancelarCompromisso} style={[styles.botao, { backgroundColor: '#ff4d4d' }]}>
            <Text style={styles.botaoTexto}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Rodapé com ícones */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.iconButton} onPress={() => navigation.navigate('MaterialSelection')}>
          <FontAwesome5 name="recycle" size={24} color="green" />
          <Text style={styles.iconText}>Descartar</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.iconButton} onPress={() => navigation.navigate('Education')}>
          <FontAwesome5 name="lightbulb" size={24} color="orange" />
          <Text style={styles.iconText}>Você sabia?</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.iconButton} onPress={() => navigation.navigate('Splash')}>
          <FontAwesome5 name="arrow-left" size={24} color="red" />
          <Text style={styles.iconText}>Voltar</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: '#a8f9d2',
    flexGrow: 1,
  },
  header: {
    alignItems: 'center',
    marginBottom: 15,
  },
  avatarContainer: {
    borderRadius: 75,
    width: 150,
    height: 150,
    overflow: 'hidden',
    backgroundColor: '#dcdcdc',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  avatar: {
    width: 150,
    height: 150,
  },
  avatarText: {
    color: '#666',
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  dadosContainer: {
    marginVertical: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
  },
  dadosTitulo: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#444',
  },
  camposDados: {
    marginTop: 10,
  },
  dado: {
    fontSize: 16,
    marginVertical: 2,
  },
  agendaContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    marginVertical: 15,
  },
  inputCompromisso: {
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 5,
    padding: 10,
    marginTop: 10,
    backgroundColor: '#fafafa',
  },
  botaoHorario: {
    marginTop: 10,
    backgroundColor: '#007aff',
    padding: 12,
    borderRadius: 5,
    alignItems: 'center',
  },
  botoesRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 15,
  },
  botao: {
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 5,
  },
  botaoTexto: {
    color: '#fff',
    fontWeight: 'bold',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
  },
  iconButton: {
    alignItems: 'center',
  },
  iconText: {
    marginTop: 4,
    fontSize: 12,
  },
});

export default HomeScreen;
