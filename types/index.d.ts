import type { IStripeConnectInitParams, StripeConnectInstance } from "../types";

export declare const loadConnectAndInitialize: (
  initParams: IStripeConnectInitParams
) => StripeConnectInstance;
export * from "./shared";
export * from "./config";
