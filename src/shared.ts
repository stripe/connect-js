export type LoadConnect = (...args: Parameters<any>) => Promise<any | null>;

interface IStripeConnect {
  onLoad?: () => void;
  init?: (params: IStripeConnectInit) => void;
}
interface IStripeConnectInit {
  publishableKey: string;
  clientSecret: string;
  metaOptions?: IStripeMetaOptions;
}

export interface IStripeMetaOptions {
  apiKeyOverride: string;
  merchantIdOverride: string;
  platformIdOverride: string;
  livemodeOverride: boolean;
  hostApp: string;
}
declare global {
  interface Window {
    StripeConnect?: IStripeConnect;
  }
}

interface StripeConnectWrapper {
  stripeConnect: IStripeConnect;
  initialize: (params: IStripeConnectInit) => void;
}

const EXISTING_SCRIPT_MESSAGE =
  "loadStripe.setLoadParameters was called but an existing Connect.js script already exists in the document; existing script parameters will be used";
const V0_URL = "https://.stripe.com/v0.1";
const V0_URL_REGEX = /^https:\/\/connect-js\.stripe\.com\/v0.1\/?(\?.*)?$/;

export const findScript = (): HTMLScriptElement | null => {
  const scripts = document.querySelectorAll<HTMLScriptElement>(
    `script[src^="${V0_URL}"]`
  );

  for (let i = 0; i < scripts.length; i++) {
    const script = scripts[i];

    if (!V0_URL_REGEX.test(script.src)) {
      continue;
    }

    return script;
  }

  return null;
};

const injectScript = (): HTMLScriptElement => {
  const script = document.createElement("script");
  script.src = "https://connect-js.stripe.com/v0.1/connect.js";

  const head = document.head;

  if (!head) {
    throw new Error(
      "Expected document.body not to be null. Connect.js requires a <body> element."
    );
  }

  document.head.appendChild(script);

  return script;
};

let stripePromise: Promise<any> | null = null;

export const loadScript = (): Promise<any> | null => {
  // Ensure that we only attempt to load Connect.js at most once
  if (stripePromise !== null) {
    return stripePromise;
  }

  stripePromise = new Promise((resolve, reject) => {
    if (typeof window === "undefined" || typeof document === "undefined") {
      // Resolve to null when imported server side. This makes the module
      // safe to import in an isomorphic code base.
      resolve(null);
      return;
    }

    if (window.StripeConnect) {
      console.warn(EXISTING_SCRIPT_MESSAGE);
    }

    if (window.StripeConnect) {
      const wrapper = createWrapper(window.StripeConnect);
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
        if (window.StripeConnect) {
          const wrapper = createWrapper(window.StripeConnect);
          resolve(wrapper);
        } else {
          reject(new Error("Connect.js not available"));
        }
      });

      script.addEventListener("error", () => {
        reject(new Error("Failed to load Connect.js"));
      });
    } catch (error) {
      reject(error);
      return;
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

const createWrapper = (stripeConnect: IStripeConnect) => {
  const wrapper: StripeConnectWrapper = {
    stripeConnect: stripeConnect,
    initialize: (params: IStripeConnectInit) => {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      window.StripeConnect!.init!({
        publishableKey: params.publishableKey,
        clientSecret: params.clientSecret
      });
    }
  };
  return wrapper;
};
