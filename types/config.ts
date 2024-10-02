/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-vars */

export type CollectionOptions = {
  fields: "currently_due" | "eventually_due";
  futureRequirements?: "omit" | "include";
};

export type NotificationCount = {
  total: number;
  actionRequired: number;
};

export type LoaderStart = {
  elementTagName: string;
};

export type LoadError = {
  elementTagName: string;
  error: EmbeddedError;
};

export type StepChange = {
  step: string;
};

export type EmbeddedError = {
  type: EmbeddedErrorType;
  message?: string;
};

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
    setOnExit: (_listener: (() => void) | undefined): void => {},
    setOnStepChange: (
      _listener: (({ step }: StepChange) => void) | undefined
    ): void => {}
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
  "payment-details": {
    setPayment: (_payment: string | undefined): void => {},
    setOnClose: (_listener: (() => void) | undefined): void => {}
  },
  "tax-settings": {
    setHideProductTaxCodeSelector: (_hidden: boolean | undefined): void => {},
    setDisplayHeadOfficeCountries: (
      _countries: string[] | undefined
    ): void => {},
    setOnTaxSettingsUpdated: (
      _listener: (({ id }: { id: string }) => void) | undefined
    ): void => {}
  },
  "tax-registrations": {
    setOnAfterTaxRegistrationAdded: (
      _listener: (({ id }: { id: string }) => void) | undefined
    ): void => {},
    setDisplayCountries: (_countries: string[] | undefined): void => {}
  }
};
