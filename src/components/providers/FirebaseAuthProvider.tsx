"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { Session } from "next-auth";
import { auth } from "@/lib/firebase/client";
import { signInWithCustomToken } from "firebase/auth";

type Props = { children: React.ReactNode };

const FirebaseAuth = ({ children }: Props) => {
  const { data: session } = useSession();

  const syncFirebaseAuth = async (session: Session | null) => {
    if (!session || !session.firebaseToken) {
      auth.signOut();
      return;
    }

    try {
      await signInWithCustomToken(auth, session.firebaseToken);
    } catch (error) {
      alert("Firebase Auth error:" + error);
    }
  };

  useEffect(() => {
    if (!session) return;

    syncFirebaseAuth(session);
  }, [session]);

  return <>{children}</>;
};

export default FirebaseAuth;
