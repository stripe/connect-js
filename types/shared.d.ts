export declare type LoadConnect = () => Promise<StripeConnectWrapper>;

export declare type OverlayOption = "dialog" | "drawer";

export declare type UIConfigOptions = {
  overlay?: OverlayOption;
  overlayZIndex?: number;
};

export declare type AppearanceOptions = {
  colorPrimary?: string;
  // Primary Button
  colorPrimaryButtonBorder?: string;
  colorPrimaryButtonBackground?: string;
  colorPrimaryButtonText?: string;
  // Secondary Button
  colorSecondaryButtonBorder?: string;
  colorSecondaryButtonBackground?: string;
  colorSecondaryButtonText?: string;
  // Link
  colorPrimaryLinkText?: string;
  colorSecondaryLinkText?: string;
  // Border
  colorBorder?: string;
  // Form
  colorFormHighlightBorder?: string;
  colorFormAccent?: string;
  // Text
  colorText?: string;
  colorSecondaryText?: string;
  // Background
  colorBackground?: string;
  colorOffsetBackground?: string;
  colorFormBackground?: string;

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
  borderRadiusButton?: string;
  borderRadiusForm?: string;
  borderRadiusBadge?: string;

  // Body Typography
  bodyLargeFontSize?: string;
  bodyLargeFontWeight?: string;
  bodyMediumFontSize?: string;
  bodyMediumFontWeight?: string;
  bodySmallFontSize?: string;
  bodySmallFontWeight?: string;

  // Label Typography
  labelLargeFontSize?: string;
  labelLargeFontWeight?: string;
  labelLargeTextTransform?: string;
  labelMediumFontSize?: string;
  labelMediumFontWeight?: string;
  labelMediumTextTransform?: string;
  labelSmallFontSize?: string;
  labelSmallFontWeight?: string;
  labelSmallTextTransform?: string;

  // Heading Typography
  headingXLargeFontSize?: string;
  headingXLargeFontWeight?: string;
  headingXLargeTextTransform?: string;
  headingLargeFontSize?: string;
  headingLargeFontWeight?: string;
  headingLargeTextTransform?: string;
  headingMediumFontSize?: string;
  headingMediumFontWeight?: string;
  headingMediumTextTransform?: string;
  headingSmallFontSize?: string;
  headingSmallFontWeight?: string;
  headingSmallTextTransform?: string;
  headingXSmallFontSize?: string;
  headingXSmallFontWeight?: string;
  headingXSmallTextTransform?: string;

  // Spacing
  spacingScale?: string;
};

export type IStripeConnectUpdateParams = {
  appearance?: AppearanceOptions;
};

export interface IStripeConnectInitParams {
  publishableKey: string;
  clientSecret: string;
  appearance?: AppearanceOptions;
  uiConfig?: UIConfigOptions;
  refreshClientSecret?: () => Promise<string>;
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
