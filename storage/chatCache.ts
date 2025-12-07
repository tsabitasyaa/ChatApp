import { chatStorage } from "./mmkv";

const CHAT_KEY = "chat_history";

export const saveChatHistory = (messages: any[]) => {
  chatStorage.set(CHAT_KEY, JSON.stringify(messages));
};

export const loadChatHistory = (): any[] => {
  const json = chatStorage.getString(CHAT_KEY);
  return json ? JSON.parse(json) : [];
};