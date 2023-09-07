export declare type LoadConnect = () => Promise<StripeConnectWrapper>;

export declare type OverlayOption = "dialog" | "drawer";

/**
 * UI configuration options for the Connect instance.
 */
export declare type UIConfigOptions = {
  overlay?: OverlayOption;
  overlayZIndex?: number;
};

/**
 * Appearance options for the Connect instance.
 */
export declare type AppearanceOptions = {
  colorPrimary?: string;
  // Primary Button
  buttonPrimaryColorBorder?: string;
  buttonPrimaryColorBackground?: string;
  buttonPrimaryColorText?: string;
  // Secondary Button
  buttonSecondaryColorBorder?: string;
  buttonSecondaryColorBackground?: string;
  buttonSecondaryColorText?: string;
  // Link
  actionPrimaryColorText?: string;
  actionSecondaryColorText?: string;
  // Border
  colorBorder?: string;
  // Form
  formHighlightColorBorder?: string;
  formAccentColor?: string;
  // Text
  colorText?: string;
  colorSecondaryText?: string;
  // Background
  colorBackground?: string;
  offsetBackgroundColor?: string;
  formBackgroundColor?: string;

  // Feedback Colors
  colorDanger?: string;

  // Neutral Badge Colors
  badgeNeutralBorderColor?: string;
  badgeNeutralBackgroundColor?: string;
  badgeNeutralTextColor?: string;

  // Success Badge Colors
  badgeSuccessBorderColor?: string;
  badgeSuccessBackgroundColor?: string;
  badgeSuccessTextColor?: string;

  // Warning Badge Colors
  badgeWarningBorderColor?: string;
  badgeWarningBackgroundColor?: string;
  badgeWarningTextColor?: string;

  // Danger Badge Colors
  badgeDangerBorderColor?: string;
  badgeDangerBackgroundColor?: string;
  badgeDangerTextColor?: string;

  // Border Sizing
  borderRadius?: string;
  buttonBorderRadius?: string;
  formBorderRadius?: string;
  badgeBorderRadius?: string;
  overlayBorderRadius?: string;

  // Font Sizing
  fontSizeBase?: string;

  // Spacing
  spacingUnit?: string;

  // Body Typography
  bodyLgFontSize?: string;
  bodyLgFontWeight?: string;
  bodyMdFontSize?: string;
  bodyMdFontWeight?: string;
  bodySmFontSize?: string;
  bodySmFontWeight?: string;

  // Label Typography
  labelLgFontSize?: string;
  labelLgFontWeight?: string;
  labelLgTextTransform?: string;
  labelMdFontSize?: string;
  labelMdFontWeight?: string;
  labelMdTextTransform?: string;
  labelSmFontSize?: string;
  labelSmFontWeight?: string;
  labelSmTextTransform?: string;

  // Heading Typography
  headingXlFontSize?: string;
  headingXlFontWeight?: string;
  headingXlTextTransform?: string;
  headingLgFontSize?: string;
  headingLgFontWeight?: string;
  headingLgTextTransform?: string;
  headingMdFontSize?: string;
  headingMdFontWeight?: string;
  headingMdTextTransform?: string;
  headingSmFontSize?: string;
  headingSmFontWeight?: string;
  headingSmTextTransform?: string;
  headingXsFontSize?: string;
  headingXsFontWeight?: string;
  headingXsTextTransform?: string;
};

export type IStripeConnectUpdateParams = {
  appearance?: AppearanceOptions;
};

/**
 * Initialization parameters for Connect JS. See https://stripe.com/docs/connect/get-started-connect-embedded-components#configuring-connect-js for more details.
 */
export interface IStripeConnectInitParams {
  /**
   * The publishable key for the connected account.
   */
  publishableKey: string;

  /**
   * The client secret for the connected account.
   */
  clientSecret: string;

  /**
   * Appearance options for the Connect instance.
   * @see https://stripe.com/docs/connect/customize-connect-embedded-components
   */
  appearance?: AppearanceOptions;

  /**
   * UI configuration options for the Connect instance.
   */
  uiConfig?: UIConfigOptions;

  /**
   * Callback function that returns a new client secret. Used to support long running sessions and called on account session expiry.
   */
  refreshClientSecret?: () => Promise<string>;

  /**
   * The locale to use for the Connect instance.
   */
  locale?: string;
}

export interface StripeConnectWrapper {
  /**
   * Initializes a Connect JS instance that can be used to create and update Connect components.
   * @param params Initialization parameters for Connect JS. See https://stripe.com/docs/connect/get-started-connect-embedded-components#configuring-connect-js for more details.
   * @returns A Connect JS instance.
   */
  initialize: (params: IStripeConnectInitParams) => StripeConnectInstance;
}

export interface StripeConnectInstance {
  /**
   * Creates a Connect element.
   * @tagName Name of the Connect component to create.
   * @returns An HTML component corresponding to that connect component
   */
  create: (tagName: ConnectElementTagName) => HTMLElement | null;

  /**
   * Updates the Connect instance with new parameters.
   * @options New parameters to update the Connect instance with.
   */
  update: (options: IStripeConnectUpdateParams) => void;

  /**
   * Logs the user out of Connect JS sessions
   * @returns A promise that resolves when the user is logged out.
   */
  logout: () => Promise<void>;
}

/**
 * Tagnames to be used with the `create` method of the Connect instance.
 */
export type ConnectElementTagName =
  | "payments"
  | "payouts"
  | "payment-details"
  | "account-onboarding";

export declare const findScript: () => HTMLScriptElement | null;

export declare const loadScript: () => Promise<any | null>;

export declare const initStripeConnect: (
  stripeConnectPromise: StripeConnectWrapper | null
) => any | null;
