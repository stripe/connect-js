export type LoadConnect = (...args: Parameters<any>) => Promise<any | null>;

type OverlayOption = "dialog" | "drawer";

type UIConfigOptions = {
  overlay?: OverlayOption;
  overlayZIndex?: number;
};

type AppearanceOptions = {
  colors?: {
    primary?: string;
  };
  fontFamily?: string;
};

interface IStripeConnectInitParams {
  publishableKey: string;
  clientSecret: string;
  appearance?: AppearanceOptions;
  uiConfig?: UIConfigOptions;
  refreshClientSecret?: () => Promise<string>;
}

interface StripeConnectWrapper {
  initialize: (params: IStripeConnectInitParams) => void;
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
      stripeConnect.init({
        ...params
      });
    }
  };
  return wrapper;
};
