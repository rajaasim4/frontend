import Joi from "joi";

export enum Env {
  Production = "production",
  Stage = "stage",
  Development = "development",
  Local = "local",
}

const envVarsSchema = Joi.object({
  REACT_APP_ENV: Joi.string()
    .valid(...Object.values(Env))
    .default(Env.Production)
    .description("Environment for the React app"),
  REACT_APP_OSE_API_BASE_URL: Joi.string().uri().required().description("Base URL for the OSE API"),
  REACT_APP_OSE_API_API_VERSION: Joi.string().required().description("API version for the OSE API"),
  REACT_APP_OSE_API_USE_MOCK: Joi.boolean().default(false).description("Boolean flag to determine whether to use mock API"),
  REACT_APP_STRIPE_PUBLISHABLE_KEY: Joi.string().required().description("Publishable key for Stripe"),
}).unknown();

const { value: envVars, error } = envVarsSchema.prefs({ errors: { label: "key" } }).validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

interface ApiConfig {
  url: string;
  apiVersion: string;
  useMock: boolean;
}

interface PaymentConfig {
  stripePublishableKey: string;
}

interface Config {
  api: ApiConfig;
  env: Env;
  payment: PaymentConfig;
}

export const config: Config = {
  env: envVars.REACT_APP_ENV as Env,
  api: {
    url: `${envVars.REACT_APP_OSE_API_BASE_URL}/${envVars.REACT_APP_OSE_API_API_VERSION}`,
    apiVersion: envVars.REACT_APP_OSE_API_API_VERSION,
    useMock: envVars.REACT_APP_OSE_API_USE_MOCK,
  },
  payment: {
    stripePublishableKey: envVars.REACT_APP_STRIPE_PUBLISHABLE_KEY,
  },
};
