import { LanguagesSupported } from "@/lib/store";
import {
  DocumentData,
  FirestoreDataConverter,
  QueryDocumentSnapshot,
  SnapshotOptions,
  Timestamp,
  collection,
  limit,
  orderBy,
  query,
} from "firebase/firestore";
import { db } from "../client";

export interface User {
  id: string;
  email: string;
  name: string;
  image: string;
}

export interface Message {
  id?: string;
  input: string;
  timestamp: Timestamp;
  user: User;
  translated?: {
    [K in LanguagesSupported]?: string;
  };
}

const messageConverter: FirestoreDataConverter<Message> = {
  toFirestore: (message: Message): DocumentData => {
    return { ...message };
  },
  fromFirestore: (
    snapshot: QueryDocumentSnapshot<Message>,
    options: SnapshotOptions,
  ): Message => {
    const data = snapshot.data(options);

    return {
      ...data,
      id: snapshot.id,
      timestamp: data.timestamp,
    };
  },
};

export const messagesRef = (chatId: string) =>
  collection(db, "chats", chatId, "messages").withConverter(messageConverter);

// // Gonna give unlimited access to free users
// export const limitedMessagesRef = (chatId: string) =>
//   query(messagesRef(chatId), limit(25));

export const sortedMessagesRef = (chatId: string) =>
  query(messagesRef(chatId), orderBy("timestamp", "asc"));

export const limitedSortedMessagesRef = (chatId: string) =>
  query(query(messagesRef(chatId), limit(1)), orderBy("timestamp", "asc"));
