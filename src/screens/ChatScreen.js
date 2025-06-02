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
} from 'react-native';
import {
  collection,
  addDoc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
} from 'firebase/firestore';
import { auth, db } from '../firebaseConfig';

const ChatScreen = ({ route }) => {
  const { chatId, catadorNome } = route.params; // Pegando chatId e catadorNome
  const currentUser = auth.currentUser;
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  useEffect(() => {
    if (!chatId) return; // Se não tiver chatId, não faz nada

    const messagesRef = collection(db, 'chats', chatId, 'messages');
    const q = query(messagesRef, orderBy('createdAt', 'asc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newMessages = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMessages(newMessages);
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

  const renderItem = ({ item }) => {
    const isUser = item.userId === currentUser.uid;

    const time = item.createdAt?.toDate
      ? new Date(item.createdAt.toDate()).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        })
      : '';

    return (
      <View
        style={[
          styles.messageContainer,
          isUser ? styles.rightAlign : styles.leftAlign,
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

        {isUser && item.avatar && (
          <Image source={{ uri: item.avatar }} style={styles.avatar} />
        )}
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={90}
    >
      {/* Mostrando o nome do catador no topo */}
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
    backgroundColor: '#eef2f5',
  },
  header: {
    padding: 15,
    backgroundColor: '#0084ff',
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
    backgroundColor: '#DCF8C6',
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
    backgroundColor: '#0084ff',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    marginLeft: 8,
  },
  sendButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
