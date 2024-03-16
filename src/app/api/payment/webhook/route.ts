import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-10-16",
});

export const buffer = async (readable: any) => {
  const chunks = [];
  for await (const chunk of readable) {
    chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
  }

  return Buffer.concat(chunks);
};

export const POST = async (req: Request) => {
  const relevantEvents = new Set([
    "product.created",
    "product.updated",
    "product.deleted",
    "price.created",
    "price.updated",
    "price.deleted",
    "checkout.session.completed",
    "checkout.session.async_payment_succeeded",
    "checkout.session.async_payment_failed",
    "customer.subscription.created",
    "customer.subscription.updated",
    "customer.subscription.deleted",
    "tax_rate.created",
    "tax_rate.updated",
    "invoice.paid",
    "invoice.payment_succeeded",
    "invoice.payment_failed",
    "invoice.upcoming",
    "invoice.marked_uncollectible",
    "invoice.payment_action_required",
    "payment_intent.processing",
    "payment_intent.succeeded",
    "payment_intent.canceled",
    "payment_intent.payment_failed",
  ]);
  let event: Stripe.Event;

  const requestBuffer = await buffer(req);

  try {
    event = stripe.webhooks.constructEvent(
      requestBuffer.toString(),
      //@ts-ignore
      req.headers["stripe-signature"],
      process.env.STRIPE_WEBHOOK_SECRET!,
    );
  } catch (err: any) {
    return Response.json({ err }, { status: err.status });
  }
};

export const config = {
  api: {
    bodyParser: false,
    externalResolver: true,
  },
};
