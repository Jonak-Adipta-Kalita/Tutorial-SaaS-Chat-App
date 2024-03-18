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

    const sub = { id: snapshot.id, ...data };
    return sub;
  },
};

export const subscriptionRef = (userId: string) =>
  collection(db, "customers", userId, "subscriptions").withConverter(
    subscriptionConverter,
  );
