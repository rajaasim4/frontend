import React, { useState } from "react";
import { LinkAuthenticationElement, PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import * as stripeJs from "@stripe/stripe-js";
import { FieldOption } from "@stripe/stripe-js/dist/stripe-js/elements/payment";

interface CheckoutFormProps {}

export function CheckoutForm(props: CheckoutFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    setIsLoading(true);

    // Create the PaymentIntent and obtain clientSecret
    const res = await fetch("http://localhost:3001/api/v1/shop/create-payment-intent", {
      method: "POST",
    });
    const paymentIntent = await res.json();
    const clientSecret = paymentIntent.client_secret;

    // Confirm the PaymentIntent using the details collected by the Express Checkout Element
    const { error } = await stripe.confirmPayment({
      // `elements` instance used to create the Express Checkout Element
      elements,
      // `clientSecret` from the created PaymentIntent
      clientSecret,
      confirmParams: {
        // Make sure to change this to your payment completion page
        return_url: `${window.location.origin}/completion`,
      },
    });

    // This point will only be reached if there is an immediate error when
    // confirming the payment. Otherwise, your customer will be redirected to
    // your `return_url`. For some payment methods like iDEAL, your customer will
    // be redirected to an intermediate site first to authorize the payment, then
    // redirected to the `return_url`.
    if (error.type === "card_error" || error.type === "validation_error") {
      setMessage(error.message ?? null);
    } else {
      setMessage("An unexpected error occured.");
    }

    setIsLoading(false);
  };

  const linkAuthenticationElementOptions: stripeJs.StripeLinkAuthenticationElementOptions = {
    defaultValues: {
      email: "lauriane@gmail.com",
    },
  };
  const paymentElementOptions: stripeJs.StripePaymentElementOptions = {
    defaultValues: {
      billingDetails: {
        email: "lauriane@gmail.com",
      },
    },
    readOnly: true,
    fields: {
      billingDetails: `never` as FieldOption,
    },
    // wallets:
    // paymentMethodOrder: ['card', 'ideal']
  };

  return (
    <form id="payment-form" onSubmit={handleSubmit}>
      <LinkAuthenticationElement id="link-authentication-element" options={linkAuthenticationElementOptions} />
      <PaymentElement id="payment-element" options={paymentElementOptions} />
      <button disabled={isLoading || !stripe || !elements} id="submit">
        <span id="button-text">{isLoading ? <div className="spinner" id="spinner"></div> : "Pay now"}</span>
      </button>
      {/* Show any error or success messages */}
      {message && <div id="payment-message">{message}</div>}
    </form>
  );
}
