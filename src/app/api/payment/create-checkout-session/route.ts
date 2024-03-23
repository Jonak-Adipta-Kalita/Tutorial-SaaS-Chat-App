import { adminAuth, adminDB } from "@/lib/firebase/admin";
import { createCustomerRecord } from "@/lib/payment/events";
import { stripe } from "@/lib/payment/stripe";
import { Timestamp } from "firebase-admin/firestore";
import { User } from "next-auth";
import Stripe from "stripe";

export const POST = async (req: Request) => {
  const { docRefId, user }: { docRefId: string; user: User } = await req.json();
  const docRef = adminDB
    .collection("customers")
    .doc(user.id)
    .collection("checkout_sessions")
    .doc(docRefId);

  const {
    client = "web",
    amount,
    currency,
    mode = "subscription",
    price,
    success_url,
    cancel_url,
    quantity = 1,
    payment_method_types,
    shipping_rates = [],
    metadata = {},
    automatic_payment_methods = { enabled: true },
    automatic_tax = false,
    invoice_creation = false,
    tax_rates = [],
    tax_id_collection = false,
    allow_promotion_codes = false,
    trial_period_days,
    line_items,
    billing_address_collection = "required",
    collect_shipping_address = false,
    customer_update = {},
    locale = "auto",
    promotion_code,
    client_reference_id,
    setup_future_usage,
    after_expiration = {},
    consent_collection = {},
    expires_at,
    phone_number_collection = {},
    payment_method_collection = "always",
  } = (await docRef.get()).data() as any;

  try {
    let customerRecord = (await docRef.parent.parent!.get()).data();
    if (!customerRecord?.stripeId) {
      const { email, phoneNumber } = await adminAuth.getUser(user.id);
      customerRecord = (await createCustomerRecord({
        uid: user.id,
        email,
        phone: phoneNumber,
      }))!;
    }

    const customer = customerRecord.stripeId;
    const shippingCountries: Stripe.Checkout.SessionCreateParams.ShippingAddressCollection.AllowedCountry[] =
      collect_shipping_address
        ? (
            await adminDB
              .collection("configuration")
              .doc("shipping_countries")
              .get()
          ).data()?.["allowed_countries"] ?? []
        : [];
    const sessionCreateParams: Stripe.Checkout.SessionCreateParams = {
      billing_address_collection,
      shipping_address_collection: { allowed_countries: shippingCountries },
      shipping_rates,
      customer,
      customer_update,
      line_items: line_items
        ? line_items
        : [
            {
              price,
              quantity,
            },
          ],
      mode,
      success_url,
      cancel_url,
      locale,
      after_expiration,
      consent_collection,
      phone_number_collection,
      ...(expires_at && { expires_at }),
    };
    if (payment_method_types) {
      sessionCreateParams.payment_method_types = payment_method_types;
    }
    if (mode === "subscription") {
      sessionCreateParams.payment_method_collection = payment_method_collection;
      sessionCreateParams.subscription_data = {
        metadata,
      };
      if (trial_period_days) {
        sessionCreateParams.subscription_data.trial_period_days =
          trial_period_days;
      }
      if (!automatic_tax) {
        sessionCreateParams.subscription_data.default_tax_rates = tax_rates;
      }
    } else if (mode === "payment") {
      sessionCreateParams.payment_intent_data = {
        metadata,
        ...(setup_future_usage && { setup_future_usage }),
      };
      if (invoice_creation) {
        sessionCreateParams.invoice_creation = {
          enabled: true,
        };
      }
    }
    if (automatic_tax) {
      sessionCreateParams.automatic_tax = {
        enabled: true,
      };
      sessionCreateParams.customer_update!.name = "auto";
      sessionCreateParams.customer_update!.address = "auto";
      sessionCreateParams.customer_update!.shipping = "auto";
    }
    if (tax_id_collection) {
      sessionCreateParams.tax_id_collection = {
        enabled: true,
      };
      sessionCreateParams.customer_update!.name = "auto";
      sessionCreateParams.customer_update!.address = "auto";
      sessionCreateParams.customer_update!.shipping = "auto";
    }
    if (promotion_code) {
      sessionCreateParams.discounts = [{ promotion_code }];
    } else {
      sessionCreateParams.allow_promotion_codes = allow_promotion_codes;
    }
    if (client_reference_id)
      sessionCreateParams.client_reference_id = client_reference_id;
    const session = await stripe.checkout.sessions.create(sessionCreateParams, {
      idempotencyKey: docRefId,
    });
    await docRef.set(
      {
        client,
        mode,
        sessionId: session.id,
        url: session.url,
        created: Timestamp.now(),
      },
      { merge: true }
    );
    return Response.json({ recieved: true });
  } catch (err: any) {
    await docRef.set(
      { error: { message: err.message, status: err.status } },
      { merge: true }
    );
    return new Response(err, { status: err.status });
  }
};
