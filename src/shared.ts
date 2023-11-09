import {
  IStripeConnectInitParams,
  StripeConnectInstance,
  ConnectElementTagName,
  ConnectHTMLElementRecord
} from "../types";
import {ConnectElementCustomMethodConfig} from '../types/config';

export type LoadConnectAndInitialize = (
  initParams: IStripeConnectInitParams
) => StripeConnectInstance;

export type ConnectElementHTMLName =
  | "stripe-connect-payments"
  | "stripe-connect-payouts"
  | "stripe-connect-payment-details"
  | "stripe-connect-account-onboarding"
  | "stripe-connect-payment-method-settings"
  | "stripe-connect-account-management"
  | "stripe-connect-notification-banner"
  | "stripe-connect-instant-payouts"
  | "stripe-connect-issuing-card"
  | "stripe-connect-issuing-cards-list";

export const componentNameMapping: Record<
  ConnectElementTagName,
  ConnectElementHTMLName
> = {
  payments: "stripe-connect-payments",
  payouts: "stripe-connect-payouts",
  "payment-details": "stripe-connect-payment-details",
  "account-onboarding": "stripe-connect-account-onboarding",
  "payment-method-settings": "stripe-connect-payment-method-settings",
  "account-management": "stripe-connect-account-management",
  "notification-banner": "stripe-connect-notification-banner",
  "instant-payouts": "stripe-connect-instant-payouts",
  "issuing-card": "stripe-connect-issuing-card",
  "issuing-cards-list": "stripe-connect-issuing-cards-list"
};

export const ComponentHTMLToTagNameMapping: Record<ConnectElementHTMLName, ConnectElementTagName> = 
  Object.keys(componentNameMapping).reduce((acc, curr) => {
    const tagName = curr as ConnectElementTagName;
    acc[componentNameMapping[tagName]] = tagName;
    return acc;
  }, {} as Record<ConnectElementHTMLName, ConnectElementTagName>);

type StripeConnectInstanceExtended = StripeConnectInstance & {
  debugInstance: () => Promise<StripeConnectInstance>;
};

interface StripeConnectWrapper {
  initialize: (params: IStripeConnectInitParams) => StripeConnectInstance;
}

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

const hasCustomMethod = (tagName: ConnectElementTagName): tagName is keyof typeof ConnectElementCustomMethodConfig => {
  return tagName in ConnectElementCustomMethodConfig;
}

const proxyMethodCallToChild = (el: HTMLElement, methodName: string) => {
  (el as any)[methodName] = function(...args: any[]) {
    ((this as HTMLElement).children.item(0) as any)[methodName](...args);
  }
}

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
        htmlName = tagName as ConnectElementHTMLName;
        tagName = ComponentHTMLToTagNameMapping[htmlName] as typeof tagName;
      }

      const wrapper = document.createElement(`${htmlName}-wrapper`);
      proxyMethodCallToChild(wrapper, 'setAttribute');
      proxyMethodCallToChild(wrapper, 'addEventListener');

      // create temporary placeholder element with same set of custom methods that store called values
      let element = document.createElement(`${htmlName}-loading`);
      wrapper.appendChild(element);

      (element as any).eventListeners = [];
      (element as any).addEventListener = function (event: string, listener: () => void) {
        (this as any).eventListeners.push([event, listener]);
      }
      if(hasCustomMethod(tagName)) {
        const methods = ConnectElementCustomMethodConfig[tagName];
        for(const method in methods) {
          // proxy wrapper custom methods calls to child
          proxyMethodCallToChild(wrapper, method);

          // temporarily store called values
          (element as any)[`${method}_value`] = undefined;
          (element as any)[`${method}`] = function(value: string) {
            this[`${method}_value`] = value;
          };
        }
      }

      stripeConnectInstance.then(instance => {
        const newElement = document.createElement(htmlName);

        for(const eventAndListener of (element as any).eventListeners) {
          const [event, listener] = eventAndListener;
          newElement.addEventListener(event, listener);
        }
        if(hasCustomMethod(tagName)) {
          const methods = ConnectElementCustomMethodConfig[tagName];
          for(const method in methods) {
            const el = element as any;
            if(el[`${method}_value`] !== undefined) {
              // calls custom method on real connect element with stored values
              (newElement as any)[`${method}`](el[`${method}_value`]);
            }
          }
        }
        for(const attr of element.attributes) {
          newElement.setAttribute(attr.name, attr.value);
        }
        element.replaceWith(newElement);

        (newElement as any).setConnector((instance as any).connect);
        element = newElement;
      });

      return wrapper as ConnectHTMLElementRecord[typeof tagName];
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
        instance.logout();
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
