import { loadScript, initStripeConnect, LoadConnect } from "./shared";

export const loadConnect: LoadConnect = () => {
  return loadScript().then(maybeStripe => initStripeConnect(maybeStripe));
};
