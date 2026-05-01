import { initStripeConnect, loadScript } from "./init";
import type {
  IStripeConnectInitParams,
  LoadConnectAndInitialize,
  StripeConnectInstance,
} from "./exportedTypes/shared";

export const loadConnectAndInitialize: LoadConnectAndInitialize = (
  initParams: IStripeConnectInitParams
): StripeConnectInstance => {
  const maybeConnect = loadScript();
  if (initParams == null) {
    throw new Error(
      "You must provide required parameters to initialize Connect"
    );
  }
  return initStripeConnect(maybeConnect, initParams);
};

// Export all types from the exportedTypes folder
export * from "./exportedTypes";
