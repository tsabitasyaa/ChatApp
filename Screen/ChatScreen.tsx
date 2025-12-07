// ChatScreen.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  auth,
  firestore,
  storage,
} from "../firebase";
import { launchImageLibrary } from "react-native-image-picker";
import { Image } from "react-native";
import { saveChatHistory, loadChatHistory } from "../storage/chatCache";


type MessageType = {
  id: string;
  text: string;
  user: string;
  imageUrl?: string;
  createdAt: any;
};

export default function ChatScreen() {
  const name = auth()?.currentUser?.email ?? "Unknown";

  const [message, setMessage] = useState<string>("");
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [usersMap, setUsersMap] = useState<Record<string, string>>({});

  // map email to username
  useEffect(() => {
    const unsub = firestore().collection('users').onSnapshot((snap) => {
      const map: Record<string, string> = {};
      snap.docs.forEach((doc) => {
        const data = doc.data();
        map[data.email] = data.username;
      });

      setUsersMap(map);
    });

    return () => unsub();
  }, []);

  // fetch messages
  useEffect(() => {
    // Load offline chat from MMKV
    const local = loadChatHistory();
    setMessages(local);

    // realtime fetch from firestore
    const q = firestore().collection('messages').orderBy('createdAt', 'asc');

    const unsub = q.onSnapshot((snap) => {
      const list = snap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as MessageType[];

      setMessages(list);

       // Save to MMKV for offline usage
        saveChatHistory(list);
    });

    return () => unsub();
  }, []);

  // send message
  const sendMessage = async () => {
    const user = auth().currentUser;

    if (!user) return;

    await firestore().collection('messages').add({
      text: message,
      user: name,
      imageUrl: "",
      createdAt: firestore.FieldValue.serverTimestamp(),
    });

    setMessage("");
    };


  const logoutHandler = () => {
    auth().signOut()
  };

  const renderItem = ({ item }: { item: MessageType }) => (
    <View
      style={[
        styles.msgBox,
        item.user === name ? styles.myMsg : styles.otherMsg,
      ]}
    >
      <Text style={styles.sender}>
        {usersMap[item.user] ?? item.user}   {/* fallback ke email kalau belum ada */}
      </Text>

      {item.imageUrl ? (
        <Image
          source={{ uri: item.imageUrl }}
          style={{ width: 200, height: 200, borderRadius: 10, marginTop: 5 }}
          resizeMode="cover"
        />
      ) : (
        <Text>{item.text}</Text>
      )}
    </View>
  );

  const uploadImage = async (uri: string) => {
    try {
      const filename = `chat_images/${Date.now()}.jpg`;
      const ref = storage().ref(filename);

      // Upload file (lebih stabil dari base64)
      await ref.putFile(uri);

      // Get URL
      const url = await ref.getDownloadURL();
      return url;

    } catch (error) {
      console.log("Upload failed:", error);
      return null;
    }
  };

  const pickImage = async () => {
    const result = await launchImageLibrary({
      mediaType: "photo",
    });

    if (!result.assets || !result.assets[0]) return;

    const image = result.assets[0];
    const uri = image.uri;
    if (!uri) return;

    try {
      const downloadURL = await uploadImage(uri);
      if (!downloadURL) return;

    await firestore().collection('messages').add({
      text: "",
      imageUrl: downloadURL,
      user: name,
      createdAt: new Date(),
    });

    } catch (error) {
      console.log("pickImage error:", error);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Chat</Text>

        <TouchableOpacity onPress={logoutHandler}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 10 }}
      />

      <View style={styles.inputRow}>
        <Button title="📷" onPress={pickImage} />

        <TextInput
          style={styles.input}
          placeholder="Ketik pesan..."
          value={message}
          onChangeText={setMessage}
        />

        <Button title="Kirim" onPress={sendMessage} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 15,
    borderBottomWidth: 1,
    borderColor: "#ccc",
  },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
  },
  logoutText: {
    color: "red",
    fontWeight: "bold",
  },
  msgBox: {
    padding: 10,
    marginVertical: 6,
    borderRadius: 6,
    maxWidth: "80%",
  },
  myMsg: {
    backgroundColor: "#d1f0ff",
    alignSelf: "flex-end",
  },
  otherMsg: {
    backgroundColor: "#eee",
    alignSelf: "flex-start",
  },
  sender: {
    fontWeight: "bold",
    marginBottom: 2,
    fontSize: 12,
  },
  inputRow: {
    flexDirection: "row",
    padding: 10,
    borderTopWidth: 1,
    borderColor: "#ccc",
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    marginRight: 10,
    padding: 8,
    borderRadius: 6,
  },
});
