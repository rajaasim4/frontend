import {
  ContributorVisibility,
  FinancialIssue,
  IssueFunding,
  IssueFundingId,
  IssueId,
  ManagedIssue,
  ManagedIssueId,
  ManagedIssueState,
  UserId,
} from "src/model";
import { BackendAPI } from "src/services";
import Decimal from "decimal.js";
import {
  CreatePaymentIntentBody,
  CreatePaymentIntentParams,
  CreatePaymentIntentQuery,
  CreatePaymentIntentResponse,
  FundIssueBody,
  FundIssueParams,
  FundIssueQuery,
  GetAvailableDowParams,
  GetAvailableDowQuery,
  GetDowPricesParams,
  GetDowPricesQuery,
  GetDowPricesResponse,
  GetIssueParams,
  GetIssueQuery,
  GetIssuesParams,
  RequestIssueFundingBody,
  RequestIssueFundingParams,
  RequestIssueFundingQuery,
} from "src/dtos";
import { issue, issueId, owner, repository, user, userId } from "src/__mocks__/index";
import { ApiError } from "src/ultils/error/ApiError";
import Stripe from "stripe";

export class BackendAPIMock implements BackendAPI {
  async getFinancialIssue(params: GetIssueParams, query: GetIssueQuery): Promise<FinancialIssue | ApiError> {
    const financialIssues = await this.getFinancialIssues({}, {});
    if (financialIssues instanceof ApiError) return financialIssues;
    else return financialIssues[0];
  }

  async getFinancialIssues(params: GetIssuesParams, query: GetIssueQuery): Promise<FinancialIssue[] | ApiError> {
    const financialIssues: FinancialIssue[] = [];

    const requestedDowAmount = 12;

    for (const managedIssue of allManagedIssues(requestedDowAmount)) {
      for (let i = 0; i < 4; i++) {
        let financialIssue: FinancialIssue;
        if (i === 0) {
          financialIssue = new FinancialIssue(owner, repository, issue, user, managedIssue, []);
        } else {
          financialIssue = new FinancialIssue(owner, repository, issue, user, managedIssue, [issueFunding((requestedDowAmount / 2) * i)]);
        }
        financialIssues.push(financialIssue);
      }
    }
    return financialIssues;
  }

  async getAvailableDow(params: GetAvailableDowParams, query: GetAvailableDowQuery): Promise<Decimal | ApiError> {
    return Promise.resolve(new Decimal(2));
  }

  async fundIssue(params: FundIssueParams, body: FundIssueBody, query: FundIssueQuery): Promise<void | ApiError> {
    return Promise.resolve(undefined);
  }

  async login(): Promise<void | ApiError> {
    return Promise.resolve(undefined);
  }

  async rejectFunding(userId: UserId, issueId: IssueId): Promise<void | ApiError> {
    return Promise.resolve(undefined);
  }

  async requestFunding(params: RequestIssueFundingParams, body: RequestIssueFundingBody, query: RequestIssueFundingQuery): Promise<void | ApiError> {
    return Promise.resolve(undefined);
  }

  async splitFunding(userId: UserId, issueId: IssueId, funders: [UserId, Decimal][]): Promise<void | ApiError> {
    return Promise.resolve(undefined);
  }

  async updateIssueGitHubStatus(issueId: IssueId, status: string): Promise<void | ApiError> {
    return Promise.resolve(undefined);
  }

  createPaymentIntent(
    params: CreatePaymentIntentParams,
    body: CreatePaymentIntentBody,
    query: CreatePaymentIntentQuery,
  ): Promise<CreatePaymentIntentResponse | ApiError> {
    const response: CreatePaymentIntentResponse = {
      paymentIntent: testPaymentIntent,
    };
    return Promise.resolve(response);
  }

  getDowPrices(params: GetDowPricesParams, query: GetDowPricesQuery): Promise<GetDowPricesResponse | ApiError> {
    const response: GetDowPricesResponse = {
      subscriptionPrices: [testPrice],
      oneTimePrices: [testPrice],
    };
    return Promise.resolve(response);
  }
}

function issueFunding(amount: number): IssueFunding {
  return new IssueFunding(new IssueFundingId(Math.random().toString()), issueId, userId, new Decimal(amount));
}

function allManagedIssues(requestedDowAmount: number): ManagedIssue[] {
  const allManagedIssues: ManagedIssue[] = [];

  for (const visibility of Object.values(ContributorVisibility)) {
    for (const state of Object.values(ManagedIssueState)) {
      const managedIssue: ManagedIssue = {
        id: new ManagedIssueId(Math.random().toString()),
        githubIssueId: issueId,
        requestedDowAmount: new Decimal(requestedDowAmount),
        managerId: userId,
        contributorVisibility: visibility,
        state: state,
      };
      allManagedIssues.push(managedIssue);
    }
  }

  return allManagedIssues;
}

const testPaymentIntent: Stripe.PaymentIntent = {
  id: "pi_test_123",
  object: "payment_intent",
  amount: 1000,
  amount_capturable: 500,
  amount_received: 1000,
  application: null,
  application_fee_amount: null,
  automatic_payment_methods: null,
  canceled_at: null,
  cancellation_reason: null,
  capture_method: "automatic",
  client_secret: "pi_test_123_secret_ABC",
  confirmation_method: "automatic",
  created: Math.floor(Date.now() / 1000),
  currency: "usd",
  customer: null,
  description: "Test Payment Intent",
  invoice: null,
  last_payment_error: null,
  latest_charge: null,
  livemode: false,
  metadata: {},
  next_action: null,
  on_behalf_of: null,
  payment_method: null,
  payment_method_configuration_details: null,
  payment_method_options: null,
  payment_method_types: ["card"],
  processing: null,
  receipt_email: "test@example.com",
  review: null,
  setup_future_usage: null,
  shipping: null,
  source: null,
  statement_descriptor: "TEST DESCRIPTOR",
  statement_descriptor_suffix: null,
  status: "requires_payment_method",
  transfer_data: null,
  transfer_group: null,
};

const testRecurring: Stripe.Price.Recurring = {
  aggregate_usage: "sum",
  interval: "month",
  interval_count: 3,
  meter: null,
  trial_period_days: 14,
  usage_type: "licensed",
};

const testCurrencyOptions: Stripe.Price.CurrencyOptions = {
  custom_unit_amount: null,
  tax_behavior: "exclusive",
  tiers: undefined,
  unit_amount: 1000,
  unit_amount_decimal: "1000.00",
};

const testPrice: Stripe.Price = {
  id: "price_test_123",
  object: "price",
  active: true,
  billing_scheme: "per_unit",
  created: Math.floor(Date.now() / 1000),
  currency: "usd",
  currency_options: {
    usd: testCurrencyOptions,
  },
  custom_unit_amount: null,
  livemode: false,
  lookup_key: null,
  metadata: {
    exampleKey: "exampleValue",
  },
  nickname: "Test Price",
  product: "prod_test_123",
  recurring: testRecurring,
  tax_behavior: "exclusive",
  tiers: undefined,
  tiers_mode: null,
  transform_quantity: null,
  type: "recurring",
  unit_amount: 1000,
  unit_amount_decimal: "1000.00",
};
