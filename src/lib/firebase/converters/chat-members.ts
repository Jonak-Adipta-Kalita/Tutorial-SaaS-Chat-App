import {
  DocumentData,
  FirestoreDataConverter,
  QueryDocumentSnapshot,
  SnapshotOptions,
  collection,
  doc,
  query,
  where,
} from "firebase/firestore";
import { db } from "../client";

export interface ChatMember {
  userId: string;
  email: string;
  timestamp: Date | null;
  isAdmin: boolean;
  chatId: string;
  image: string;
}

const chatMembersConverter: FirestoreDataConverter<ChatMember> = {
  toFirestore: (member: ChatMember): DocumentData => {
    return {
      ...member,
      isAdmin: !!member.isAdmin,
    };
  },
  fromFirestore: (
    snapshot: QueryDocumentSnapshot<ChatMember>,
    options: SnapshotOptions,
  ) => {
    const data = snapshot.data(options);

    const sub = { ...data, userId: snapshot.id };
    return sub;
  },
};

export const chatMembersRef = (chatId: string) =>
  doc(db, "chats", chatId, "members").withConverter(chatMembersConverter);

export const addChatRef = (chatId: string, userId: string) =>
  doc(db, "chats", chatId, "members", userId).withConverter(
    chatMembersConverter,
  );

export const chatMemberAdminRef = (chatId: string) =>
  query(
    collection(db, "chats", chatId, "members"),
    where("isAdmin", "==", true),
  ).withConverter(chatMembersConverter);

export const chatMembersCollectionGroupRef = (userId: string) =>
  query(collection(db, "members"), where("userId", "==", userId)).withConverter(
    chatMembersConverter,
  );
