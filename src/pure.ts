import { IStripeConnectInitParams, StripeConnectInstance } from "../types";
import {
  loadScript,
  initStripeConnect,
  LoadConnectAndInitialize
} from "./shared";

export const loadConnectAndInitialize: LoadConnectAndInitialize = (
  initParams: IStripeConnectInitParams
): StripeConnectInstance => {
  const maybeConnect = loadScript();
  return initStripeConnect(maybeConnect, initParams);
};
