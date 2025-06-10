import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Animated,
} from 'react-native';
import {
  collection,
  addDoc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  deleteDoc,
  doc,
} from 'firebase/firestore';
import { auth, db } from '../firebaseConfig';

const ChatScreen = ({ route }) => {
  const { chatId, catadorNome } = route.params;
  const currentUser = auth.currentUser;
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [animations, setAnimations] = useState({});

  useEffect(() => {
    if (!chatId) return;

    const messagesRef = collection(db, 'chats', chatId, 'messages');
    const q = query(messagesRef, orderBy('createdAt', 'asc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newMessages = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMessages(newMessages);

      // Inicializa as animações para novas mensagens
      const newAnimations = {};
      newMessages.forEach(msg => {
        if (!animations[msg.id]) {
          newAnimations[msg.id] = new Animated.Value(1);
        } else {
          newAnimations[msg.id] = animations[msg.id];
        }
      });
      setAnimations(newAnimations);
    });

    return unsubscribe;
  }, [chatId]);

  const handleSend = async () => {
    if (!input.trim()) return;

    await addDoc(collection(db, 'chats', chatId, 'messages'), {
      text: input,
      createdAt: serverTimestamp(),
      userId: currentUser.uid,
      nome: currentUser.displayName || 'Você',
      avatar: currentUser.photoURL || null,
    });

    setInput('');
  };

  const handleDeleteMessage = (messageId) => {
    Alert.alert(
      'Confirmar exclusão',
      'Tem certeza que deseja apagar esta mensagem?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Apagar',
          style: 'destructive',
          onPress: async () => {
            try {
              // Animação de fade antes de apagar
              Animated.timing(animations[messageId], {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
              }).start(async () => {
                const messageRef = doc(db, 'chats', chatId, 'messages', messageId);
                await deleteDoc(messageRef);
              });
            } catch (error) {
              console.error('Erro ao apagar mensagem:', error);
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  const renderItem = ({ item }) => {
    const isUser = item.userId === currentUser.uid;
    const time = item.createdAt?.toDate
      ? new Date(item.createdAt.toDate()).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        })
      : '';

    return (
      <Animated.View
        style={[
          styles.messageContainer,
          isUser ? styles.rightAlign : styles.leftAlign,
          { opacity: animations[item.id] || 1 },
        ]}
      >
        {!isUser && item.avatar && (
          <Image source={{ uri: item.avatar }} style={styles.avatar} />
        )}

        <View
          style={[
            styles.messageBubble,
            isUser ? styles.sentMessage : styles.receivedMessage,
          ]}
        >
          {!isUser && <Text style={styles.senderName}>{item.nome}</Text>}
          <Text style={styles.messageText}>{item.text}</Text>
          <Text style={styles.timeText}>{time}</Text>
        </View>

        {isUser && (
          <TouchableOpacity
            style={styles.trashIcon}
            onPress={() => handleDeleteMessage(item.id)}
          >
            <Text style={styles.trashEmoji}>🗑️</Text>
          </TouchableOpacity>
        )}

        {isUser && item.avatar && (
          <Image source={{ uri: item.avatar }} style={styles.avatar} />
        )}
      </Animated.View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={90}
    >
      <View style={styles.header}>
        <Text style={styles.headerText}>{catadorNome || 'Chat'}</Text>
      </View>

      <FlatList
        data={messages}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.chatContainer}
      />

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={input}
          onChangeText={setInput}
          placeholder="Digite uma mensagem"
          placeholderTextColor="#999"
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
          <Text style={styles.sendButtonText}>Enviar</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default ChatScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fafff5',
  },
  header: {
    padding: 15,
    backgroundColor: '#a8f9d4',
    alignItems: 'center',
  },
  headerText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  chatContainer: {
    padding: 10,
    paddingBottom: 80,
  },
  messageContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginVertical: 4,
  },
  rightAlign: {
    justifyContent: 'flex-end',
  },
  leftAlign: {
    justifyContent: 'flex-start',
  },
  messageBubble: {
    maxWidth: '70%',
    padding: 10,
    borderRadius: 10,
  },
  sentMessage: {
    backgroundColor: '#ddfada',
    marginLeft: 'auto',
  },
  receivedMessage: {
    backgroundColor: '#fff',
    marginRight: 'auto',
  },
  senderName: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#555',
    marginBottom: 3,
  },
  messageText: {
    fontSize: 16,
    color: '#333',
  },
  timeText: {
    fontSize: 10,
    color: '#999',
    alignSelf: 'flex-end',
    marginTop: 4,
  },
  avatar: {
    width: 35,
    height: 35,
    borderRadius: 20,
    marginHorizontal: 6,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 8,
    backgroundColor: '#fff',
    alignItems: 'center',
    borderTopWidth: 1,
    borderColor: '#ccc',
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
  input: {
    flex: 1,
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: '#f2f2f2',
    borderRadius: 20,
    fontSize: 16,
  },
  sendButton: {
    backgroundColor: '#00FF9C',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    marginLeft: 8,
  },
  sendButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  trashIcon: {
    marginLeft: 6,
    marginTop: 5,
  },
  trashEmoji: {
    fontSize: 18,
  },
});
