"use client";

import { subscriptionRef } from "@/lib/firebase/converters/subscription";
import { useSubscriptionStore } from "@/lib/store";
import { onSnapshot } from "firebase/firestore";
import { useSession } from "next-auth/react";
import { ReactNode, useEffect } from "react";

const SubscriptionProvider = ({ children }: { children: ReactNode }) => {
  const { data: session } = useSession();
  const { setSubscription } = useSubscriptionStore();

  useEffect(() => {
    if (!session) return;

    return onSnapshot(
      subscriptionRef(session?.user.id),
      (snapshot) => {
        if (snapshot.empty) {
          setSubscription(null);
          return;
        }

        setSubscription(snapshot.docs[0].data());
      },
      (error) => {
        alert(error);
      },
    );
  }, [session, setSubscription]);

  return <>{children}</>;
};

export default SubscriptionProvider;
