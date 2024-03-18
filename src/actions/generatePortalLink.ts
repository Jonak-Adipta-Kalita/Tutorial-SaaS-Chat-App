"use server";

import { authOptions } from "@/lib/auth";
import { adminDB } from "@/lib/firebase/admin";
import { stripe } from "@/lib/payment/stripe";
import { getServerSession } from "next-auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export const generatePortalLink = async () => {
  const session = await getServerSession(authOptions);
  const host = headers().get("host");

  if (!session?.user.id) return;
  const {
    user: { id },
  } = session;

  const returnUrl = `${process.env.NODE_ENV === "production" ? "https" : "http"}://${host}/register`;

  const doc = await adminDB.collection("customers").doc(id).get();
  if (!doc.data)
    return console.log("No customer record found with userId: ", id);

  const stripeId = doc.data()!.stripeId;

  const stripeSession = await stripe.billingPortal.sessions.create({
    customer: stripeId,
    return_url: returnUrl,
  });

  redirect(stripeSession.url);
};
