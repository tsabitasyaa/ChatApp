//ChatApp/Screen/LoginScreen.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  TouchableOpacity,
} from "react-native";

import {
  auth,
  firestore
} from "../firebase";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState("");

  const handleSubmit = async () => {
    try {
      if (isRegister) {
        const userCred = await auth().createUserWithEmailAndPassword(email, password);
        const uid = userCred.user.uid;

        // simpan profile di collection users dengan doc ID = uid
        await firestore().collection('users').doc(uid).set({
        username: username || 'User',
        email,
        createdAt: firestore.FieldValue.serverTimestamp(),
        });

        Alert.alert('Sukses', 'Akun berhasil dibuat!');
      } else {
        await auth().signInWithEmailAndPassword(email, password);
      }
    } catch (err: any) {
      Alert.alert('Error', err.message ?? String(err));
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {isRegister ? "Register Akun" : "Login ke ChatApp"}
      </Text>

        {isRegister && (
            <TextInput
              style={styles.input}
              placeholder="Username"
              value={username}
              onChangeText={setUsername}
            />
        )}

      <TextInput
        style={styles.input}
        placeholder="Email"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <Button
        title={isRegister ? "Daftar" : "Masuk"}
        onPress={handleSubmit}
      />

      <TouchableOpacity
        onPress={() => setIsRegister(!isRegister)}
        style={{ marginTop: 20 }}
      >
        <Text style={{ textAlign: "center", color: "blue" }}>
          {isRegister
            ? "Sudah punya akun? Login"
            : "Belum punya akun? Registrasi"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 26,
    textAlign: "center",
    marginBottom: 30,
    fontWeight: "bold",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
  },
});
