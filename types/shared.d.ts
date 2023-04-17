export declare type LoadConnect = (
  ...args: Parameters<any>
) => Promise<any | null>;

export declare type OverlayOption = "dialog" | "drawer";

export declare type UIConfigOptions = {
  overlay?: OverlayOption;
  overlayZIndex?: number;
};

export declare type AppearanceOptions = {
  colorPrimary?: string;
  fontFamily?: string;
};

export type IStripeConnectUpdateParams = {
  appearance?: AppearanceOptions;
  uiConfig?: UIConfigOptions;
};

export interface IStripeConnectInitParams {
  publishableKey: string;
  clientSecret: string;
  appearance?: AppearanceOptions;
  uiConfig?: UIConfigOptions;
  refreshClientSecret?: () => Promise<string>;
}

export interface StripeConnectWrapper {
  initialize: (params: IStripeConnectInitParams) => StripeConnectInstance;
}

export interface StripeConnectInstance {
  create: (tagName: ConnectElementTagName) => HTMLElement | null;
  update: (options: IStripeConnectUpdateParams) => void;
}

export type ConnectElementTagName =
  | "stripe-connect-payments"
  | "stripe-connect-payouts"
  | "stripe-connect-account-onboarding"
  | "stripe-connect-account-management"
  | "stripe-connect-instant-payouts"
  | "stripe-connect-payment-details";

export declare const findScript: () => HTMLScriptElement | null;

export declare const loadScript: () => Promise<any | null>;

export declare const initStripeConnect: (
  stripeConnectPromise: StripeConnectWrapper | null
) => any | null;
