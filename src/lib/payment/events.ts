import { CustomerData } from "@/typings/stripe-payments";
import { stripe } from "./stripe";
import { adminDB } from "../firebase/admin";

export const createCustomerRecord = async ({
  uid,
  email,
  phone,
}: {
  email?: string;
  phone?: string;
  uid: string;
}) => {
  try {
    const customerData: CustomerData = {
      metadata: {
        firebaseUID: uid,
      },
    };
    if (email) customerData.email = email;
    if (phone) customerData.phone = phone;
    const customer = await stripe.customers.create(customerData);

    const customerRecord = {
      email: customer.email,
      stripeId: customer.id,
      stripeLink: `https://dashboard.stripe.com${
        customer.livemode ? "" : "/test"
      }/customers/${customer.id}`,
    };
    if (phone) (customerRecord as any).phone = phone;
    await adminDB
      .collection("customers")
      .doc(uid)
      .set(customerRecord, { merge: true });
    return customerRecord;
  } catch (err) {
    return null;
  }
};
