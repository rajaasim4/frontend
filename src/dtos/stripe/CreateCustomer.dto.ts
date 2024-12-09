import { StripeCustomer } from "../../model";

export interface CreateCustomerParams {}

export interface CreateCustomerResponse {
  stripeCustomer: StripeCustomer;
}

export interface CreateCustomerBody {
  countryCode?: string;
}

export interface CreateCustomerQuery {}
