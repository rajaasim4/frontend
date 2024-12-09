import { StripeCustomerId } from "../../model";
import { PriceItem } from "./index";
import Stripe from "stripe";

export interface CreateSubscriptionParams {}

export interface CreateSubscriptionResponse {
  subscription: Stripe.Subscription;
}

export interface CreateSubscriptionBody {
  stripeCustomerId: StripeCustomerId;
  priceItems: PriceItem[];
}

export interface CreateSubscriptionQuery {}
