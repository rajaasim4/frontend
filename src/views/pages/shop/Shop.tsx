import React from "react";
import { Elements } from "@stripe/react-stripe-js";
import * as stripeJs from "@stripe/stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { CheckoutForm } from "./elements";
import { config } from "src/ultils";

// TODO: lolo
const stripePromise = loadStripe(config.payment.stripePublishableKey);

// https://docs.stripe.com/elements/express-checkout-element
interface ShopProps {}

export function Shop(props: ShopProps) {
  const options: stripeJs.StripeElementsOptions = {
    mode: "payment", // 'payment' | 'setup' | 'subscription'
    amount: 1099,
    currency: "usd",
    appearance: {
      variables: {
        // This controls the border-radius of the rendered Express Checkout Element
        borderRadius: "4px",
      },
    },
  };

  return (
    <>
      <div>
        <h6>Pay one time</h6>
        <button>Pay $10.99 for 1 time</button>
      </div>

      <div>
        <h6>Subscription</h6>
        <button>Pay $10.99 for 1 time</button>
      </div>

      <Elements stripe={stripePromise} options={options}>
        <CheckoutForm />
      </Elements>
    </>
  );
}
