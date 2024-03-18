import Stripe from "stripe";
import { adminAuth, adminDB } from "../firebase/admin";
import {
  Price,
  Product,
  Subscription,
  TaxRate,
} from "@/typings/stripe-payments";
import { Timestamp } from "firebase-admin/firestore";
import { stripe } from "./stripe";

const prefixMetadata = (metadata: any) =>
  Object.keys(metadata).reduce((prefixedMetadata: any, key: any) => {
    prefixedMetadata[`stripe_metadata_${key}`] = metadata[key];
    return prefixedMetadata;
  }, {});

export const createProductRecord = async (
  product: Stripe.Product,
): Promise<void> => {
  const { firebaseRole, ...rawMetadata } = product.metadata;

  const productData: Product = {
    active: product.active,
    name: product.name,
    description: product.description,
    role: firebaseRole ?? null,
    images: product.images,
    metadata: product.metadata,
    tax_code: product.tax_code ?? null,
    ...prefixMetadata(rawMetadata),
  };
  await adminDB
    .collection("products")
    .doc(product.id)
    .set(productData, { merge: true });
};

export const insertPriceRecord = async (price: Stripe.Price): Promise<void> => {
  if (price.billing_scheme === "tiered")
    price = await stripe.prices.retrieve(price.id, { expand: ["tiers"] });

  const priceData: Price = {
    active: price.active,
    billing_scheme: price.billing_scheme,
    tiers_mode: price.tiers_mode,
    tiers: price.tiers ?? null,
    currency: price.currency,
    description: price.nickname,
    type: price.type,
    unit_amount: price.unit_amount,
    recurring: price.recurring,
    interval: price.recurring?.interval ?? null,
    interval_count: price.recurring?.interval_count ?? null,
    trial_period_days: price.recurring?.trial_period_days ?? null,
    transform_quantity: price.transform_quantity,
    tax_behavior: price.tax_behavior ?? null,
    metadata: price.metadata,
    product: price.product,
    ...prefixMetadata(price.metadata),
  };
  const dbRef = adminDB
    .collection("products")
    .doc(price.product as string)
    .collection("prices");
  await dbRef.doc(price.id).set(priceData, { merge: true });
};

export const deleteProductOrPrice = async (
  pr: Stripe.Product | Stripe.Price,
) => {
  if (pr.object === "product") {
    await adminDB.collection("products").doc(pr.id).delete();
  }
  if (pr.object === "price") {
    await adminDB
      .collection("products")
      .doc((pr as Stripe.Price).product as string)
      .collection("prices")
      .doc(pr.id)
      .delete();
  }
};

export const insertTaxRateRecord = async (
  taxRate: Stripe.TaxRate,
): Promise<void> => {
  const taxRateData: TaxRate = {
    ...taxRate,
    ...prefixMetadata(taxRate.metadata),
  };
  delete taxRateData.metadata;
  await adminDB
    .collection("products")
    .doc("tax_rates")
    .collection("tax_rates")
    .doc(taxRate.id)
    .set(taxRateData);
};

const copyBillingDetailsToCustomer = async (
  payment_method: Stripe.PaymentMethod,
): Promise<void> => {
  const customer = payment_method.customer as string;
  const { name, phone, address } = payment_method.billing_details;
  //@ts-ignore
  await stripe.customers.update(customer, { name, phone, address });
};

export const manageSubscriptionStatusChange = async (
  subscriptionId: string,
  customerId: string,
  createAction: boolean,
): Promise<void> => {
  // Get customer's UID from Firestore
  const customersSnap = await adminDB
    .collection("customers")
    .where("stripeId", "==", customerId)
    .get();
  if (customersSnap.size !== 1) {
    throw new Error("User not found!");
  }
  const uid = customersSnap.docs[0].id;
  // Retrieve latest subscription status and write it to the Firestore
  const subscription = await stripe.subscriptions.retrieve(subscriptionId, {
    expand: ["default_payment_method", "items.data.price.product"],
  });
  const price: Stripe.Price = subscription.items.data[0].price;
  const prices = [];
  for (const item of subscription.items.data) {
    prices.push(
      adminDB
        .collection("products")
        .doc((item.price.product as Stripe.Product).id)
        .collection("prices")
        .doc(item.price.id),
    );
  }
  const product: Stripe.Product = price.product as Stripe.Product;
  const role = product.metadata.firebaseRole ?? null;
  // Get reference to subscription doc in Cloud Firestore.
  const subsDbRef = customersSnap.docs[0].ref
    .collection("subscriptions")
    .doc(subscription.id);
  // Update with new Subscription status
  const subscriptionData: Subscription = {
    metadata: subscription.metadata,
    role,
    status: subscription.status,
    stripeLink: `https://dashboard.stripe.com${
      subscription.livemode ? "" : "/test"
    }/subscriptions/${subscription.id}`,
    product: adminDB.collection("products").doc(product.id),
    price: adminDB
      .collection("products")
      .doc(product.id)
      .collection("prices")
      .doc(price.id),
    prices,
    quantity: subscription.items.data[0].quantity!,
    items: subscription.items.data,
    cancel_at_period_end: subscription.cancel_at_period_end,
    cancel_at: subscription.cancel_at
      ? Timestamp.fromMillis(subscription.cancel_at * 1000)
      : null,
    canceled_at: subscription.canceled_at
      ? Timestamp.fromMillis(subscription.canceled_at * 1000)
      : null,
    current_period_start: Timestamp.fromMillis(
      subscription.current_period_start * 1000,
    ),
    current_period_end: Timestamp.fromMillis(
      subscription.current_period_end * 1000,
    ),
    created: Timestamp.fromMillis(subscription.created * 1000),
    ended_at: subscription.ended_at
      ? Timestamp.fromMillis(subscription.ended_at * 1000)
      : null,
    trial_start: subscription.trial_start
      ? Timestamp.fromMillis(subscription.trial_start * 1000)
      : null,
    trial_end: subscription.trial_end
      ? Timestamp.fromMillis(subscription.trial_end * 1000)
      : null,
  };
  await subsDbRef.set(subscriptionData);

  // Update their custom claims
  if (role) {
    try {
      // Get existing claims for the user
      const { customClaims } = await adminAuth.getUser(uid);
      // Set new role in custom claims as long as the subs status allows
      if (["trialing", "active"].includes(subscription.status)) {
        await adminAuth.setCustomUserClaims(uid, {
          ...customClaims,
          stripeRole: role,
        });
      } else {
        await adminAuth.setCustomUserClaims(uid, {
          ...customClaims,
          stripeRole: null,
        });
      }
    } catch (error) {
      // User has been deleted, simply return.
      return;
    }
  }

  // NOTE: This is a costly operation and should happen at the very end.
  // Copy the billing deatils to the customer object.
  if (createAction && subscription.default_payment_method) {
    await copyBillingDetailsToCustomer(
      subscription.default_payment_method as Stripe.PaymentMethod,
    );
  }

  return;
};

export const insertInvoiceRecord = async (invoice: Stripe.Invoice) => {
  // Get customer's UID from Firestore
  const customersSnap = await adminDB
    .collection("customers")
    .where("stripeId", "==", invoice.customer)
    .get();
  if (customersSnap.size !== 1) {
    throw new Error("User not found!");
  }
  // Write to invoice to a subcollection on the subscription doc.
  await customersSnap.docs[0].ref
    .collection("subscriptions")
    .doc(invoice.subscription as string)
    .collection("invoices")
    .doc(invoice.id)
    .set(invoice);

  const prices = [];
  for (const item of invoice.lines.data) {
    prices.push(
      adminDB
        .collection("products")
        .doc(item.price!.product as string)
        .collection("prices")
        .doc(item.price!.id),
    );
  }

  // An Invoice object does not always have an associated Payment Intent
  const recordId: string = (invoice.payment_intent as string) ?? invoice.id;

  // Update subscription payment with price data
  await customersSnap.docs[0].ref
    .collection("payments")
    .doc(recordId)
    .set({ prices }, { merge: true });
};

export const insertPaymentRecord = async (
  payment: Stripe.PaymentIntent,
  checkoutSession?: Stripe.Checkout.Session,
) => {
  // Get customer's UID from Firestore
  const customersSnap = await adminDB
    .collection("customers")
    .where("stripeId", "==", payment.customer)
    .get();
  if (customersSnap.size !== 1) {
    throw new Error("User not found!");
  }
  if (checkoutSession) {
    const lineItems = await stripe.checkout.sessions.listLineItems(
      checkoutSession.id,
    );
    const prices = [];
    for (const item of lineItems.data) {
      prices.push(
        adminDB
          .collection("products")
          .doc(item.price!.product as string)
          .collection("prices")
          .doc(item.price!.id),
      );
    }
    //@ts-ignore
    payment["prices"] = prices;
    //@ts-ignore
    payment["items"] = lineItems.data;
  }
  // Write to invoice to a subcollection on the customer doc.
  await customersSnap.docs[0].ref
    .collection("payments")
    .doc(payment.id)
    .set(payment, { merge: true });
};
