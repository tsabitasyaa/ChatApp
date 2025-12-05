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
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  firestore,
  setDoc,
  doc,
} from "../firebase";

export default function LoginScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegister, setIsRegister] = useState(false);
  const [username, setUsername] = useState("");

  const handleSubmit = async () => {
    try {
      if (isRegister) {
        const userCred = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );

        await setDoc(doc(firestore, "users", userCred.user.uid), {
          username: username,
          email: email,
          createdAt: new Date(),
        });

        Alert.alert("Sukses", "Akun berhasil dibuat!");

      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      // Tidak perlu navigate manual — App.tsx akan otomatis pindah ke Chat
    } catch (err) {
      Alert.alert("Error", (err as Error).message);
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