import { initStripeConnect, loadScript } from "./init";
import type {
  IStripeConnectInitParams,
  StripeConnectInstance,
  LoadConnectAndInitialize,
} from "./exportedTypes/shared";

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

// Export all types from the exportedTypes folder
export * from "./exportedTypes";
