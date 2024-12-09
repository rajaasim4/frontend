import React from "react";
import { Elements } from "@stripe/react-stripe-js";
import * as stripeJs from "@stripe/stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { CheckoutForm, CheckoutPage } from "./elements";

const stripePromise = loadStripe("pk_test_51PyDEVP1HLKJuuAxtULPkFnRdqYrnGrKq50P4XYoMCweq7eMPFbvFTAZTFxbvnESdHO0pI47G49dn3U2cabj4egv00AIe4yt96");

// https://docs.stripe.com/elements/express-checkout-element
interface ShopProps {}

export function Shop(props: ShopProps) {
  const options: stripeJs.StripeElementsOptions = {
    mode: "payment",
    amount: 1099,
    currency: "usd",
    // Customizable with appearance API.
    appearance: {
      variables: {
        // This controls the border-radius of the rendered Express Checkout Element
        borderRadius: "4px",
      },
    },
  };

  return (
    <Elements stripe={stripePromise} options={options}>
      {/*<CheckoutPage />*/}
      <CheckoutForm />
    </Elements>
  );
}
