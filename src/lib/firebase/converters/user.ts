import {
  collection,
  DocumentData,
  FirestoreDataConverter,
  query,
  QueryDocumentSnapshot,
  SnapshotOptions,
  where,
} from "firebase/firestore";
import { User } from "next-auth";
import { db } from "../client";

const userConverter: FirestoreDataConverter<User> = {
  toFirestore: (customer: User): DocumentData => {
    return { ...customer };
  },
  fromFirestore: (
    snapshot: QueryDocumentSnapshot<User>,
    options: SnapshotOptions
  ) => {
    const data = snapshot.data(options);

    return { ...data, id: snapshot.id };
  },
};

export const getUserByEmailRef = (email: string) =>
  query(collection(db, "users"), where("email", "==", email)).withConverter(
    userConverter
  );
