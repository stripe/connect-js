import { ConnectElementCustomMethodConfig } from "./config";

export declare type LoadConnectAndInitialize = (
  initParams: IStripeConnectInitParams
) => StripeConnectInstance;

export declare type OverlayOption = "dialog" | "drawer";

/*
 * Use a `CssFontSource` to pass custom fonts via a stylesheet URL when initializing a Connect instance.
 */
export declare type CssFontSource = {
  /**
   * A relative or absolute URL pointing to a CSS file with [@font-face](https://developer.mozilla.org/en/docs/Web/CSS/@font-face) definitions, for example:
   *
   *     https://fonts.googleapis.com/css?family=Open+Sans
   *
   * Note that if you are using a [content security policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy) (CSP), [additional directives](https://stripe.com/docs/security#content-security-policy) may be necessary.
   */
  cssSrc: string;
};

/*
 * Use a `CustomFontSource` to pass custom fonts when initializing a Connect instance.
 */
export declare type CustomFontSource = {
  /**
   * The name to give the font
   */
  family: string;

  /**
   * A valid [src](https://developer.mozilla.org/en-US/docs/Web/CSS/@font-face/src) value pointing to your custom font file.
   * This is usually (though not always) a link to a file with a `.woff` , `.otf`, or `.svg` suffix.
   */
  src: string;

  /**
   * A valid [font-display](https://developer.mozilla.org/en-US/docs/Web/CSS/@font-face/font-display) value.
   */
  display?: string;

  /**
   * Defaults to `normal`.
   */
  style?: "normal" | "italic" | "oblique";

  /**
   * A valid [unicode-range](https://developer.mozilla.org/en-US/docs/Web/CSS/@font-face/unicode-range) value.
   */
  unicodeRange?: string;

  /**
   * A valid [font-weight](https://developer.mozilla.org/en-US/docs/Web/CSS/font-weight), as a string.
   */
  weight?: string;
};

/**
 * Appearance options for the Connect instance.
 */
export declare type AppearanceOptions = {
  /**
   * The type of overlay used throughout the Connect.js design system. Set this to be either a Dialog or Drawer.
   */
  overlays?: OverlayOption;
  variables?: AppearanceVariables;
};

export declare type AppearanceVariables = {
  // Commonly used

  /**
   * The font family value used throughout embedded components. If an embedded component inherits a font-family value from an element on your site in which it’s placed, this setting overrides that inheritance.
   */
  fontFamily?: string;

  /**
   * The baseline font size set on the embedded component root. This scales the value of other font size variables. This supports pixel values only.
   */
  fontSizeBase?: string;

  /**
   * The base spacing unit that derives all spacing values. Increase or decrease this value to make your layout more or less spacious. This supports pixel values only.
   */
  spacingUnit?: string;

  /**
   * The general border radius used in embedded components. This sets the default border radius for all components. This supports pixel values only.
   */
  borderRadius?: string;

  /**
   * The primary color used throughout embedded components. Set this to your primary brand color. This accepts hex values or RGB/HSL strings.
   */
  colorPrimary?: string;

  /**
   * The background color for embedded components, including overlays, tooltips, and popovers. This accepts hex values or RGB/HSL strings.
   */
  colorBackground?: string;

  /**
   * The color used for regular text. This accepts hex values or RGB/HSL strings.
   */
  colorText?: string;

  /**
   * The color used to indicate errors or destructive actions. This accepts hex values or RGB/HSL strings.
   */
  colorDanger?: string;

  // Less commonly used

  // Primary Button
  /**
   * The color used as a background for primary buttons. This accepts hex values or RGB/HSL strings.
   */
  buttonPrimaryColorBackground?: string;
  /**
   * The border color used for primary buttons. This accepts hex values or RGB/HSL strings.
   */
  buttonPrimaryColorBorder?: string;
  /**
   * The text color used for primary buttons. This accepts hex values or RGB/HSL strings.
   */
  buttonPrimaryColorText?: string;

  // Secondary Button
  /**
   * The color used as a background for secondary buttons. This accepts hex values or RGB/HSL strings.
   */
  buttonSecondaryColorBackground?: string;
  /**
   * The color used as a border for secondary buttons. This accepts hex values or RGB/HSL strings.
   */
  buttonSecondaryColorBorder?: string;
  /**
   * The text color used for secondary buttons. This accepts hex values or RGB/HSL strings.
   */
  buttonSecondaryColorText?: string;

  /**
   * The color used for secondary text. This accepts hex values or RGB/RGBA/HSL strings.
   */
  colorSecondaryText?: string;
  /**
   * The color used for primary actions and links. This accepts hex values or RGB/HSL strings.
   */
  actionPrimaryColorText?: string;
  /**
   * The color used for secondary actions and links. This accepts hex values or RGB/HSL strings.
   */
  actionSecondaryColorText?: string;

  // Neutral Badge Colors
  /**
   * The background color used to represent neutral state or lack of state in status badges. This accepts hex values or RGB/HSL strings.
   */
  badgeNeutralColorBackground?: string;
  /**
   * The text color used to represent neutral state or lack of state in status badges. This accepts hex values or RGB/HSL strings.
   */
  badgeNeutralColorText?: string;
  /**
   * The border color used to represent neutral state or lack of state in status badges. This accepts hex values or RGB/RGBA/HSL strings.
   */
  badgeNeutralColorBorder?: string;

  // Success Badge Colors
  /**
   * The background color used to reinforce a successful outcome in status badges. This accepts hex values or RGB/HSL strings.
   */
  badgeSuccessColorBackground?: string;
  /**
   * The text color used to reinforce a successful outcome in status badges. This accepts hex values or RGB/HSL strings.
   */
  badgeSuccessColorText?: string;
  /**
   * The border color used to reinforce a successful outcome in status badges. This accepts hex values or RGB/RGBA/HSL strings.
   */
  badgeSuccessColorBorder?: string;

  // Warning Badge Colors
  /**
   * The background color used in status badges to highlight things that might require action, but are optional to resolve. This accepts hex values or RGB/HSL strings.
   */
  badgeWarningColorBackground?: string;
  /**
   * The text color used in status badges to highlight things that might require action, but are optional to resolve. This accepts hex values or RGB/HSL strings.
   */
  badgeWarningColorText?: string;
  /**
   * The border color used in status badges to highlight things that might require action, but are optional to resolve. This accepts hex values or RGB/RGBA/HSL strings.
   */
  badgeWarningColorBorder?: string;

  // Danger Badge Colors
  /**
   * The background color used in status badges for high-priority, critical situations that the user must address immediately, and to indicate failed or unsuccessful outcomes. This accepts hex values or RGB/HSL strings.
   */
  badgeDangerColorBackground?: string;
  /**
   * The text color used in status badges for high-priority, critical situations that the user must address immediately, and to indicate failed or unsuccessful outcomes. This accepts hex values or RGB/HSL strings.
   */
  badgeDangerColorText?: string;
  /**
   * The border color used in status badges for high-priority, critical situations that the user must address immediately, and to indicate failed or unsuccessful outcomes. This accepts hex values or RGB/RGBA/HSL strings.
   */
  badgeDangerColorBorder?: string;

  // Background
  /**
   * The background color used when highlighting information, like the selected row on a table or particular piece of UI. This accepts hex values or RGB/HSL strings.
   */
  offsetBackgroundColor?: string;
  /**
   * The background color used for form items. This accepts hex values or RGB/HSL strings.
   */
  formBackgroundColor?: string;

  /**
   * The color used for borders throughout the component. This accepts hex values or RGB/RGBA/HSL strings.
   */
  colorBorder?: string;

  // Form
  /**
   * The color used to highlight form items when focused. This accepts hex values or RGB/RGBA/HSL strings.
   */
  formHighlightColorBorder?: string;
  /**
   * The color used for to fill in form items like checkboxes, radio buttons and switches. This accepts hex values or RGB/HSL strings.
   */
  formAccentColor?: string;

  // Border Sizing
  /**
   * The border radius used for buttons. This supports pixel values only.
   */
  buttonBorderRadius?: string;
  /**
   * The border radius used for form elements. This supports pixel values only.
   */
  formBorderRadius?: string;
  /**
   * The border radius used for badges. This supports pixel values only.
   */
  badgeBorderRadius?: string;
  /**
   * The border radius used for overlays. This supports pixel values only.
   */
  overlayBorderRadius?: string;

  // Font Sizing

  // Overlay
  /**
   * A z-index to use for the overlay throughout embedded components. Set this number to control the z-order of the overlay.
   */
  overlayZIndex?: number;

  // Body Typography
  /**
   * The font size for the large body typography. Body typography variables accept a valid font size value.
   */
  bodyLgFontSize?: string;
  /**
   * The font weight for the large body typography. Body typography variables accept a valid font weight value.
   */
  bodyLgFontWeight?: string;
  /**
   * The font size for the medium body typography. Body typography variables accept a valid font size value.
   */
  bodyMdFontSize?: string;
  /**
   * The font weight for the medium body typography. Body typography variables accept a valid font weight value.
   */
  bodyMdFontWeight?: string;
  /**
   * The font size for the small body typography. Body typography variables accept a valid font size value.
   */
  bodySmFontSize?: string;
  /**
   * The font weight for the small body typography. Body typography variables accept a valid font weight value.
   */
  bodySmFontWeight?: string;

  // Heading Typography
  /**
   * The font size for the extra large heading typography. Heading typography variables accept a valid font size value.
   */
  headingXlFontSize?: string;
  /**
   * The font weight for the extra large heading typography. Heading typography variables accept a valid font weight value.
   */
  headingXlFontWeight?: string;
  /**
   * The text transform for the extra large heading typography. Heading typography variables accept a valid text transform value.
   */
  headingXlTextTransform?: string;
  /**
   * The font size for the large heading typography. Heading typography variables accept a valid font size value.
   */
  headingLgFontSize?: string;
  /**
   * The font weight for the large heading typography. Heading typography variables accept a valid font weight value.
   */
  headingLgFontWeight?: string;
  /**
   * The text transform for the large heading typography. Heading typography variables accept a valid text transform value.
   */
  headingLgTextTransform?: string;
  /**
   * The font size for the medium heading typography. Heading typography variables accept a valid font size value.
   */
  headingMdFontSize?: string;
  /**
   * The font weight for the medium heading typography. Heading typography variables accept a valid font weight value.
   */
  headingMdFontWeight?: string;
  /**
   * The text transform for the medium heading typography. Heading typography variables accept a valid text transform value.
   */
  headingMdTextTransform?: string;
  /**
   * The font size for the small heading typography. Heading typography variables accept a valid font size value.
   */
  headingSmFontSize?: string;
  /**
   * The font weight for the small heading typography. Heading typography variables accept a valid font weight value.
   */
  headingSmFontWeight?: string;
  /**
   * The text transform for the small heading typography. Heading typography variables accept a valid text transform value.
   */
  headingSmTextTransform?: string;
  /**
   * The font size for the extra small heading typography. Heading typography variables accept a valid font size value.
   */
  headingXsFontSize?: string;
  /**
   * The font weight for the extra small heading typography. Heading typography variables accept a valid font weight value.
   */
  headingXsFontWeight?: string;
  /**
   * The text transform for the extra small heading typography. Heading typography variables accept a valid text transform value.
   */
  headingXsTextTransform?: string;

  // Label Typography
  /**
   * The font size for the large label typography. Label typography variables accept a valid font size value.
   */
  labelLgFontSize?: string;
  /**
   * The font weight for the large label typography. Label typography variables accept a valid font weight value.
   */
  labelLgFontWeight?: string;
  /**
   * The text transform for the large label typography. Label typography variables accept a valid text transform value.
   */
  labelLgTextTransform?: string;
  /**
   * The font size for the medium label typography. Label typography variables accept a valid font size value.
   */
  labelMdFontSize?: string;
  /**
   * The font weight for the medium label typography. Label typography variables accept a valid font weight value.
   */
  labelMdFontWeight?: string;
  /**
   * The text transform for the medium label typography. Label typography variables accept a valid text transform value.
   */
  labelMdTextTransform?: string;
  /**
   * The font size for the small label typography. Label typography variables accept a valid font size value.
   */
  labelSmFontSize?: string;
  /**
   * The font weight for the small label typography. Label typography variables accept a valid font weight value.
   */
  labelSmFontWeight?: string;
  /**
   * The text transform for the small label typography. Label typography variables accept a valid text transform value.
   */
  labelSmTextTransform?: string;
};

export type IStripeConnectUpdateParams = {
  /**
   * Appearance options for the Connect instance.
   */
  appearance?: AppearanceOptions;

  /**
   * The locale to use for the Connect instance.
   */
  locale?: string;
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
   * Function that fetches client secret
   * @returns A promise that resolves with a new client secret.
   */
  fetchClientSecret: () => Promise<string>;

  /**
   * Appearance options for the Connect instance.
   * @see https://stripe.com/docs/connect/customize-connect-embedded-components
   */
  appearance?: AppearanceOptions;

  /**
   * The locale to use for the Connect instance.
   */
  locale?: string;

  /**
   * An array of custom fonts, which embedded components created from a ConnectInstance can use.
   */
  fonts?: Array<CssFontSource | CustomFontSource>;
}

type ConnectElementCustomMethods = typeof ConnectElementCustomMethodConfig;

type ConnectHTMLElementRecord = {
  [K in keyof ConnectElementCustomMethods]: HTMLElement &
    ConnectElementCustomMethods[K];
} & {
  [key: string]: HTMLElement;
};

export interface StripeConnectInstance {
  /**
   * Creates a Connect element.
   * @tagName Name of the Connect component to create.
   * @returns An HTML component corresponding to that connect component
   */
  create: <T extends ConnectElementTagName>(
    tagName: T
  ) => ConnectHTMLElementRecord[T];

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
  | "account-onboarding"
  | "payment-method-settings"
  | "account-management"
  | "notification-banner"
  | "instant-payouts"
  | "issuing-card"
  | "issuing-cards-list";
