/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-vars */

export type FetchEphemeralKeyFunction = (fetchParams: {
  issuingCard: string;
  nonce: string;
}) => Promise<{
  issuingCard: string;
  nonce: string;
  ephemeralKeySecret: string;
}>;

export type CollectionOptions = {
  fields: "currently_due" | "eventually_due";
  futureRequirements?: "omit" | "include";
};

export type NotificationCount = {
  total: number;
  actionRequired: number;
};

export type InstallState = {
  appId: string;
  state: "INSTALLED" | "UNINSTALLED";
};

export type LoaderStart = {
  elementTagName: string;
};

export type LoadError = {
  elementTagName: string;
  error: EmbeddedError;
};

export type EmbeddedError = {
  type: EmbeddedErrorType;
  message?: string;
};

export type FinancingProductType = {
  productType: "standard" | "refill" | "none";
};

export type FinancingPromotionLayoutType = "full" | "banner";

export type EmbeddedErrorType =
  /**
   * Failure to connect to Stripe's API.
   */
  | "api_connection_error"
  /**
   * Failure to perform the authentication flow within Connect Embedded Components
   */
  | "authentication_error"
  /**
   * Account session create failed
   */
  | "account_session_create_error"
  /**
   * Request failed with an 4xx status code, typically caused by platform configuration issues
   */
  | "invalid_request_error"
  /**
   * Too many requests hit the API too quickly.
   */
  | "rate_limit_error"
  /**
   * API errors covering any other type of problem (e.g., a temporary problem with Stripe's servers), and are extremely uncommon.
   */
  | "api_error";

export const ConnectElementCommonMethodConfig = {
  setOnLoadError: (
    _listener: (({ error, elementTagName }: LoadError) => void) | undefined
  ): void => {},
  setOnLoaderStart: (
    _listener: (({ elementTagName }: LoaderStart) => void) | undefined
  ): void => {}
};

export const ConnectElementCustomMethodConfig = {
  "payment-details": {
    setPayment: (_payment: string | undefined): void => {},
    setOnClose: (_listener: (() => void) | undefined): void => {}
  },
  "account-onboarding": {
    setFullTermsOfServiceUrl: (
      _termOfServiceUrl: string | undefined
    ): void => {},
    setRecipientTermsOfServiceUrl: (
      _recipientTermsOfServiceUrl: string | undefined
    ): void => {},
    setPrivacyPolicyUrl: (_privacyPolicyUrl: string | undefined): void => {},
    setSkipTermsOfServiceCollection: (
      _skipTermsOfServiceCollection: boolean | undefined
    ): void => {},
    setCollectionOptions: (
      _collectionOptions: CollectionOptions | undefined
    ): void => {},
    setOnExit: (_listener: (() => void) | undefined): void => {}
  },
  "account-management": {
    setCollectionOptions: (
      _collectionOptions: CollectionOptions | undefined
    ): void => {}
  },
  "notification-banner": {
    setCollectionOptions: (
      _collectionOptions: CollectionOptions | undefined
    ): void => {},
    setOnNotificationsChange: (
      _listener:
        | (({ total, actionRequired }: NotificationCount) => void)
        | undefined
    ): void => {}
  },
  "issuing-card": {
    setDefaultCard: (_defaultCard: string | undefined): void => {},
    setCardSwitching: (_cardSwitching: boolean | undefined): void => {},
    setFetchEphemeralKey: (
      _fetchEphemeralKey: FetchEphemeralKeyFunction | undefined
    ): void => {}
  },
  "issuing-cards-list": {
    setFetchEphemeralKey: (
      _fetchEphemeralKey: FetchEphemeralKeyFunction | undefined
    ): void => {}
  },
  "financial-account": {
    setFinancialAccount: (_financialAccount: string): void => {}
  },
  "financial-account-transactions": {
    setFinancialAccount: (_financialAccount: string): void => {}
  },
  "app-install": {
    setApp: (_app: string | undefined): void => {},
    setOnAppInstallStateFetched: (
      _listener: (({ appId, state }: InstallState) => void) | undefined
    ): void => {},
    setOnAppInstallStateChanged: (
      _listener: (({ appId, state }: InstallState) => void) | undefined
    ): void => {}
  },
  "app-viewport": {
    setApp: (_app: string | undefined): void => {},
    setAppData: (_appData: Record<string, string> | undefined): void => {}
  },
  "payment-method-settings": {
    setPaymentMethodConfiguration: (
      _paymentMethodConfiguration: string | undefined
    ): void => {}
  },
  "capital-financing": {
    setDefaultFinancingOffer: (
      _defaultFinancingOffer: string | undefined
    ): void => {},
    setShowFinancingSelector: (
      _showFinancingSelector: boolean | undefined
    ): void => {},
    setFaqUrl: (_faqUrl: string | undefined): void => {},
    setSupportUrl: (_supportUrl: string | undefined): void => {},
    setOnFinancingsLoaded: (
      _listener: (({ total }: { total: number }) => void) | undefined
    ): void => {}
  },
  "capital-financing-application": {
    setOnApplicationSubmitted: (_listener: (() => void) | undefined): void => {}
  },
  "capital-financing-promotion": {
    setLayout: (_layout: FinancingPromotionLayoutType | undefined): void => {},
    setOnApplicationSubmitted: (
      _listener: (() => void) | undefined
    ): void => {},
    setOnEligibleFinancingOfferLoaded: (
      _listener: (({ productType }: FinancingProductType) => void) | undefined
    ): void => {}
  }
};
