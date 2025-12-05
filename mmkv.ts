import { createMMKV } from "react-native-mmkv";

export const storageMmkv = createMMKV({
  id: "chatapp_storage",
});

// Simpan JSON
export function setJson(key: string, value: any) {
  try {
    storageMmkv.set(key, JSON.stringify(value));
  } catch (e) {
    console.log("MMKV JSON SET ERROR:", e);
  }
}

// Ambil JSON
export function getJson(key: string) {
  const value = storageMmkv.getString(key);
  if (!value) return null;

  try {
    return JSON.parse(value);
  } catch (e) {
    console.log("MMKV JSON GET ERROR:", e);
    return null;
  }
}