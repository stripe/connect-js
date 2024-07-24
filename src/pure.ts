import type { IStripeConnectInitParams, StripeConnectInstance } from "../types";
import {
  loadScript,
  initStripeConnect,
  LoadConnectAndInitialize
} from "./shared";

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
