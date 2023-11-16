import { ConnectElementTagName } from "./shared.d";

/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-vars */

export const ConnectElementCustomMethodConfig = {
  "payment-details": {
    setPayment: (payment: string | undefined): void => {},
    setOnClose: (listener: (() => void) | undefined): void => {}
  },
  "account-onboarding": {
    setFullTermsOfServiceUrl: (
      termOfServiceUrl: string | undefined
    ): void => {},
    setRecipientTermsOfServiceUrl: (
      recipientTermsOfServiceUrl: string | undefined
    ): void => {},
    setPrivacyPolicyUrl: (privacyPolicyUrl: string | undefined): void => {},
    setSkipTermsOfServiceCollection: (
      skipTermsOfServiceCollection: boolean | undefined
    ): void => {},
    setOnExit: (listener: (() => void) | undefined): void => {}
  }
};

// ensure that keys of ConnectElementCustomMethodConfig are from ConnectElementTagName
type HasType<T, Q extends T> = Q;
type CustomMethodConfigValidation = HasType<
  ConnectElementTagName,
  keyof typeof ConnectElementCustomMethodConfig
>;
