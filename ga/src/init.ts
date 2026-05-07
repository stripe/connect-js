import {
  ConnectElementCommonMethodConfig,
  ConnectElementCustomMethodConfig,
  connectElementTagNames,
} from "./components/componentsAndSetters";
import type { ConnectHTMLElementRecord } from "./exportedTypes/shared";
import type {
  ConnectElementTagName,
  IStripeConnectInitParams,
  StripeConnectInstance,
  StripeConnectWrapper,
} from "./exportedTypes/shared";
import {
  EXISTING_SCRIPT_MESSAGE,
  findScript,
  injectScript,
} from "./utils/scriptUtils";

export type ConnectElementHTMLName = `stripe-connect-${ConnectElementTagName}`;

export const componentNameMapping = connectElementTagNames.reduce(
  (acc, name) => {
    acc[name] = `stripe-connect-${name}`;
    return acc;
  },
  {} as Record<ConnectElementTagName, ConnectElementHTMLName>
);

type StripeConnectInstanceExtended = StripeConnectInstance & {
  debugInstance: () => Promise<StripeConnectInstance>;
};

let stripePromise: Promise<StripeConnectWrapper> | null = null;

export const isWindowStripeConnectDefined = (stripeConnect: unknown) => {
  // We only consider `StripeConnect` defined if `init` is a function
  // Why? HTML markup like:
  // <a id="StripeConnect"><a id="StripeConnect" name="init" href="stripe"></a></a> in the <head> of the page
  // can end up "contaminating" the window.StripeConnect object and cause issues in connect.js initialization
  return !!(
    stripeConnect &&
    typeof stripeConnect === "object" &&
    "init" in stripeConnect &&
    typeof (stripeConnect as { init: unknown } & Record<string, unknown>)
      .init === "function"
  );
};

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

    if (isWindowStripeConnectDefined((window as any).StripeConnect)) {
      console.warn(EXISTING_SCRIPT_MESSAGE);
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
        if (isWindowStripeConnectDefined((window as any).StripeConnect)) {
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
  const eagerClientSecretPromise = (() => {
    try {
      return initParams.fetchClientSecret();
    } catch (error) {
      return Promise.reject(error);
    }
  })();
  const metaOptions = (initParams as any).metaOptions ?? {};
  const stripeConnectInstance = stripePromise.then((wrapper) =>
    wrapper.initialize({
      ...initParams,
      metaOptions: { ...metaOptions, eagerClientSecretPromise },
    } as any)
  );

  return {
    create: (tagName) => {
      let htmlName = componentNameMapping[tagName];
      if (!htmlName) {
        htmlName = tagName as unknown as ConnectElementHTMLName;
      }
      const element = document.createElement(htmlName);

      const customMethods = hasCustomMethod(tagName)
        ? ConnectElementCustomMethodConfig[tagName]
        : {};
      const methods = { ...customMethods, ...ConnectElementCommonMethodConfig };
      for (const method in methods) {
        (element as any)[method] = function (value: any) {
          stripeConnectInstance.then(() => {
            if (!this[`${method}InternalOnly`]) {
              throw new Error(
                `Method ${method} is not available in the ${tagName} HTML element. Are you using a supported version of the "@stripe/connect-js" package? Using version: _NPM_PACKAGE_VERSION_`
              );
            }

            this[`${method}InternalOnly`](value);
          });
        };
      }

      stripeConnectInstance.then((instance) => {
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

        if (!element || !(element as any).setConnector) {
          throw new Error(
            `Element ${tagName} was not transformed into a custom element. Are you using a documented component? See https://docs.stripe.com/connect/supported-embedded-components for a list of supported components`
          );
        }

        (element as any).setConnector((instance as any).connect);
      });

      return element as ConnectHTMLElementRecord[typeof tagName];
    },
    update: (updateOptions) => {
      stripeConnectInstance.then((instance) => {
        instance.update(updateOptions);
      });
    },
    debugInstance: () => {
      return stripeConnectInstance;
    },
    logout: () => {
      return stripeConnectInstance.then((instance) => {
        return instance.logout();
      });
    },
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
            sdkVersion: "_NPM_PACKAGE_VERSION_",
          },
        },
      });
      return stripeConnectInstance;
    },
  };
  return wrapper;
};
