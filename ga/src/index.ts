import type { IStripeConnectInitParams, StripeConnectInstance } from "../types";
import type { LoadConnectAndInitialize } from "./shared";
import { loadScript, initStripeConnect } from "./shared";

// Execute our own script injection after a tick to give users time to do their
// own script injection.
const stripePromise = Promise.resolve().then(() => loadScript());

let loadCalled = false;

stripePromise.catch((err: Error) => {
  if (!loadCalled) {
    console.warn(err);
  }
});

export const loadConnectAndInitialize: LoadConnectAndInitialize = (
  initParams: IStripeConnectInitParams
): StripeConnectInstance => {
  loadCalled = true;
  return initStripeConnect(stripePromise, initParams);
};
