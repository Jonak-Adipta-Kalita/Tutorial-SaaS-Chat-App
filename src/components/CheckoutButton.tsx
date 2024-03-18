"use client";

import { db } from "@/lib/firebase/client";
import { addDoc, collection, onSnapshot } from "firebase/firestore";
import { useSession } from "next-auth/react";
import { useState } from "react";
import LoadingSpinner from "./LoadingSpinner";

const CheckoutButton = () => {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);

  const createCheckoutSession = async () => {
    if (!session?.user?.id) return;
    setLoading(true);

    const docRef = await addDoc(
      collection(db, "customers", session.user.id, "checkout_sessions"),
      {
        price: "price_1OvYUOSCMiKn0Wru4SdSivRo",
        success_url: window.location.origin + "/chat",
        cancel_url: window.location.origin,
      },
    );

    await fetch("/api/payment/create-checkout-session", {
      method: "POST",
      body: JSON.stringify({ docRefId: docRef.id, user: session?.user }),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });

    return onSnapshot(docRef, (snap) => {
      const data = snap.data();
      const url = data?.url;
      const error = data?.error;

      if (error) {
        alert(`An error occured: ${error.message}`);
        setLoading(false);
      }

      if (url) {
        window.location.assign(url);
        setLoading(false);
      }
    });
  };

  return (
    <div className="flex flex-col spance-y-2">
      <button
        onClick={() => createCheckoutSession()}
        className="mt-8 block rounded-md bg-indigo-600 px-3.5 py-2 text-center text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 cursor-pointer disabled:opacity-80 disabled:bg-indigo-600/50 disabled:text-white disabled:cursor-default"
      >
        {!loading ? <LoadingSpinner /> : "Sign Up"}
      </button>
    </div>
  );
};

export default CheckoutButton;
