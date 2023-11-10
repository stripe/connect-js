import {
  IStripeConnectInitParams,
  StripeConnectInstance,
  ConnectElementTagName,
  ConnectHTMLElementRecord,
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

const ComponentHTMLToTagNameMapping: Record<ConnectElementHTMLName, ConnectElementTagName> = 
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

const createConnectElementWrapper = (tagName: ConnectElementTagName, htmlName: ConnectElementHTMLName) => {
  const wrapper = document.createElement(`${htmlName}-wrapper`);
  proxyMethodCallToChild(wrapper, 'setAttribute');
  proxyMethodCallToChild(wrapper, 'addEventListener');
  if(hasCustomMethod(tagName)) {
    const methods = ConnectElementCustomMethodConfig[tagName];
    for(const method in methods) {
      proxyMethodCallToChild(wrapper, method);
    }
  }
  return wrapper;
}

const createPlaceholderConnectElement = <T extends ConnectElementTagName>(tagName: T, htmlName: typeof componentNameMapping[T]) => {
  const placeholder = document.createElement(`${htmlName}-loading`);
  (placeholder as any).storedEventListeners = [];
  placeholder.addEventListener = function (event: string, listener: any) {
    (this as any).storedEventListeners.push([event, listener]);
  }
  if(hasCustomMethod(tagName)) {
    const methods = ConnectElementCustomMethodConfig[tagName];
    for(const method in methods) {
      (placeholder as any)[`${method}_value`] = undefined;
      (placeholder as any)[`${method}`] = function(value: string) {
        // temporarily store called values
        this[`${method}_value`] = value;
      };
    }
  }
  return placeholder as ConnectHTMLElementRecord[T];
};

const replacePlaceholderConnectElement = <T extends ConnectElementTagName>(tagName: T, htmlName: typeof componentNameMapping[T], placeholder: ConnectHTMLElementRecord[T]) => {
  const element = document.createElement(htmlName);

  // call custom setters methods on real connect elements
  if(hasCustomMethod(tagName)) {
    const methods = ConnectElementCustomMethodConfig[tagName];
    for(const method in methods) {
      const el = placeholder as any;
      if(el[`${method}_value`] !== undefined) {
        // calls custom method on real connect element with stored values
        (element as any)[`${method}`](el[`${method}_value`]);
      }
    }
  }
  // move attributes to real connect element
  for(const attr of placeholder.attributes) {
    element.setAttribute(attr.name, attr.value);
  }
  // move event listeners to real connect element
  for(const eventAndListener of (placeholder as any).storedEventListeners) {
    const [event, listener] = eventAndListener;
    element.addEventListener(event, listener);
  }
  placeholder.replaceWith(element);
  return element as ConnectHTMLElementRecord[T];
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
        htmlName = tagName as ConnectElementHTMLName;
        tagName = ComponentHTMLToTagNameMapping[htmlName] as typeof tagName;
      }

      const wrapper = createConnectElementWrapper(tagName, htmlName);
      const placeholder = createPlaceholderConnectElement(tagName, htmlName);
      wrapper.appendChild(placeholder);

      stripeConnectInstance.then(instance => {
        const element = replacePlaceholderConnectElement(tagName, htmlName, placeholder);
        (element as any).setConnector((instance as any).connect);
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
