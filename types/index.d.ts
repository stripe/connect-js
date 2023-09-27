import { LoadConnect } from "../src/shared";
import { IStripeConnectInitParams, StripeConnectInstance } from "../types";

export declare const loadConnect: LoadConnect;
export declare const loadConnectAndInitialize: (
  initParams: IStripeConnectInitParams
) => StripeConnectInstance;
export * from "./shared";
