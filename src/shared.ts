import {
  StripeConnectWrapper,
  IStripeConnectInitParams,
  ConnectElementTagName
} from "../types";

export type LoadConnect = () => Promise<StripeConnectWrapper>;

type ConnectElementHTMLName =
  | "stripe-connect-payments"
  | "stripe-connect-payouts"
  | "stripe-connect-payment-details"
  | "stripe-connect-account-onboarding"
  | "stripe-connect-payment-method-settings";

const componentNameMapping: Record<
  ConnectElementTagName,
  ConnectElementHTMLName
> = {
  payments: "stripe-connect-payments",
  payouts: "stripe-connect-payouts",
  "payment-details": "stripe-connect-payment-details",
  "account-onboarding": "stripe-connect-account-onboarding",
  "payment-method-settings": "stripe-connect-payment-method-settings"
};

const EXISTING_SCRIPT_MESSAGE =
  "loadConnect was called but an existing Connect.js script already exists in the document; existing script parameters will be used";
const V0_URL = "https://connect-js.stripe.com/v0.1/connect.js";

export const findScript = (): HTMLScriptElement | null => {
  return document.querySelectorAll<HTMLScriptElement>(
    `script[src="${V0_URL}"]`
  )[0];
};

const injectScript = (): HTMLScriptElement => {
  const script = document.createElement("script");
  script.src = "https://connect-js.stripe.com/v0.1/connect.js";

  const head = document.head;

  if (!head) {
    throw new Error(
      "Expected document.head not to be null. Connect.js requires a <head> element."
    );
  }

  document.head.appendChild(script);

  return script;
};

let stripePromise: Promise<StripeConnectWrapper> | null = null;

export const loadScript = (): Promise<StripeConnectWrapper | null> => {
  // Ensure that we only attempt to load Connect.js at most once
  if (stripePromise !== null) {
    return stripePromise;
  }

  stripePromise = new Promise((resolve, reject) => {
    if (typeof window === "undefined") {
      reject(
        "ConnectJS won't load when rendering code in the server - it can only be loaded on a browser. This error is expected when loading ConnectJS in SSR environments, like NextJS. It will have no impact in the UI, however if you wish to avoid it, you can switch to the `pure` version of the connect.js loader: https://github.com/stripe/connect-js#importing-loadconnect-without-side-effects."
      );
      return;
    }

    if ((window as any).StripeConnect) {
      console.warn(EXISTING_SCRIPT_MESSAGE);
    }

    if ((window as any).StripeConnect) {
      const wrapper = createWrapper((window as any).StripeConnect);
      resolve(wrapper);
      return;
    }

    try {
      let script = findScript();

      if (script) {
        console.warn(EXISTING_SCRIPT_MESSAGE);
      } else if (!script) {
        script = injectScript();
      }

      script.addEventListener("load", () => {
        if ((window as any).StripeConnect) {
          const wrapper = createWrapper((window as any).StripeConnect);
          resolve(wrapper);
        } else {
          reject(new Error("Connect.js did not load the necessary objects"));
        }
      });

      script.addEventListener("error", () => {
        reject(new Error("Failed to load Connect.js"));
      });
    } catch (error) {
      reject(error);
    }
  });

  return stripePromise;
};

export const initStripeConnect = (
  stripeConnectPromise: StripeConnectWrapper | null
): any | null => {
  if (stripeConnectPromise === null) {
    return null;
  }

  return stripeConnectPromise;
};

const createWrapper = (stripeConnect: any) => {
  const wrapper: StripeConnectWrapper = {
    initialize: (params: IStripeConnectInitParams) => {
      const metaOptions = (params as any).metaOptions ?? {};
      const stripeConnectInstance = stripeConnect.init({
        ...params,
        metaOptions: {
          ...metaOptions,
          sdk: true,
          sdkOptions: {
            // This will be replaced by the npm package version when bundling
            sdkVersion: "_NPM_PACKAGE_VERSION_"
          }
        }
      });

      // We wrap create so we can map its different strings to supported components
      const oldCreate = stripeConnectInstance.create.bind(
        stripeConnectInstance
      );
      stripeConnectInstance.create = (tagName: ConnectElementTagName) => {
        let htmlName = componentNameMapping[tagName];
        if (!htmlName) {
          htmlName = tagName as ConnectElementHTMLName;
        }
        return oldCreate(htmlName);
      };
      return stripeConnectInstance;
    }
  };
  return wrapper;
};
