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
  | "stripe-connect-payment-details"
  | "stripe-connect-notification-banner";

export declare const findScript: () => HTMLScriptElement | null;

export declare const loadScript: () => Promise<any | null>;

export declare const initStripeConnect: (
  stripeConnectPromise: StripeConnectWrapper | null
) => any | null;
