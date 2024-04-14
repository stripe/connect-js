import {
  IStripeConnectInitParams,
  StripeConnectInstance,
  ConnectElementTagName,
  ConnectHTMLElementRecord
} from "../types";
import { ConnectElementCustomMethodConfig } from "../types/config";

export type LoadConnectAndInitialize = (
  initParams: IStripeConnectInitParams
) => StripeConnectInstance;

type ConnectElementHTMLName =
  | "stripe-connect-account-onboarding"
  | "stripe-connect-payments"
  | "stripe-connect-payment-details"
  | "stripe-connect-account-management"
  | "stripe-connect-notification-banner"
  | "stripe-connect-payouts"
  | "stripe-connect-payouts-list"
  | "stripe-connect-balances"
  | "stripe-connect-documents";

export const componentNameMapping: Record<
  ConnectElementTagName,
  ConnectElementHTMLName
> = {
  "account-onboarding": "stripe-connect-account-onboarding",
  payments: "stripe-connect-payments",
  "payment-details": "stripe-connect-payment-details",
  payouts: "stripe-connect-payouts",
  "payouts-list": "stripe-connect-payouts-list",
  balances: "stripe-connect-balances",
  "account-management": "stripe-connect-account-management",
  "notification-banner": "stripe-connect-notification-banner",
  documents: "stripe-connect-documents"
};

type StripeConnectInstanceExtended = StripeConnectInstance & {
  debugInstance: () => Promise<StripeConnectInstance>;
};

interface StripeConnectWrapper {
  initialize: (params: IStripeConnectInitParams) => StripeConnectInstance;
}

const EXISTING_SCRIPT_MESSAGE =
  "loadConnect was called but an existing Connect.js script already exists in the document; existing script parameters will be used";
const V0_URL = "https://connect-js.stripe.com/v1.0/connect.js";

export const findScript = (): HTMLScriptElement | null => {
  return (
    document.querySelectorAll<HTMLScriptElement>(
      `script[src="${V0_URL}"]`
    )[0] || null
  );
};

const injectScript = (): HTMLScriptElement => {
  const script = document.createElement("script");
  script.src = "https://connect-js.stripe.com/v1.0/connect.js";

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

export const loadScript = (): Promise<StripeConnectWrapper> => {
  // Ensure that we only attempt to load Connect.js at most once
  if (stripePromise !== null) {
    return stripePromise;
  }

  stripePromise = new Promise<StripeConnectWrapper>((resolve, reject) => {
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

const hasCustomMethod = (
  tagName: ConnectElementTagName
): tagName is keyof typeof ConnectElementCustomMethodConfig => {
  return tagName in ConnectElementCustomMethodConfig;
};

export const initStripeConnect = (
  stripePromise: Promise<StripeConnectWrapper>,
  initParams: IStripeConnectInitParams
): StripeConnectInstanceExtended => {
  const stripeConnectInstance = stripePromise.then(wrapper =>
    wrapper.initialize(initParams)
  );

  return {
    create: tagName => {
      let htmlName = componentNameMapping[tagName];
      if (!htmlName) {
        htmlName = (tagName as unknown) as ConnectElementHTMLName;
      }
      const element = document.createElement(htmlName);

      if (hasCustomMethod(tagName)) {
        const methods = ConnectElementCustomMethodConfig[tagName];
        for (const method in methods) {
          (element as any)[method] = function(value: any) {
            stripeConnectInstance.then(() => {
              this[`${method}InternalOnly`](value);
            });
          };
        }
      }

      stripeConnectInstance.then(instance => {
        if (!element.isConnected && !(element as any).setConnector) {
          // If the element is not connected to the DOM and the `setConnector` method is not
          // defined, this indicates the element was created before connect.js was loaded, and has
          // not been transformed into a custom element yet

          // To load the custom element code on it, we need to connect and disconnect it to the DOM
          // This isn't a problem, as the element will be invisible, and we know the element is already
          // not currently connected to the DOM

          const oldDisplay = element.style.display;
          element.style.display = "none";
          document.body.appendChild(element);
          document.body.removeChild(element);
          element.style.display = oldDisplay;
        }

        (element as any).setConnector((instance as any).connect);
      });

      return element as ConnectHTMLElementRecord[typeof tagName];
    },
    update: updateOptions => {
      stripeConnectInstance.then(instance => {
        instance.update(updateOptions);
      });
    },
    debugInstance: () => {
      return stripeConnectInstance;
    },
    logout: () => {
      return stripeConnectInstance.then(instance => {
        return instance.logout();
      });
    }
  };
};

const createWrapper = (stripeConnect: any) => {
  (window as any).StripeConnect = (window as any).StripeConnect || {};
  (window as any).StripeConnect.optimizedLoading = true;
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
      return stripeConnectInstance;
    }
  };
  return wrapper;
};
