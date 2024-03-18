import { Subscription } from "@/typings/stripe-payments";
import {
  SnapshotOptions,
  collection,
  DocumentData,
  FirestoreDataConverter,
  QueryDocumentSnapshot,
} from "firebase/firestore";
import { db } from "../client";

const subscriptionConverter: FirestoreDataConverter<Subscription> = {
  toFirestore: (subscription): DocumentData => {
    return { ...subscription };
  },
  fromFirestore: (
    snapshot: QueryDocumentSnapshot<Subscription>,
    options: SnapshotOptions,
  ): Subscription => {
    const data = snapshot.data(options);

    return { id: snapshot.id, ...data };
  },
};

export const subscriptionRef = (userId: string) =>
  collection(db, "customers", userId, "subscription").withConverter(
    subscriptionConverter,
  );
