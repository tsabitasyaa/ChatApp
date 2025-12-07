import { createMMKV } from "react-native-mmkv";

export const chatStorage = createMMKV({
  id: "chatStorage",
});