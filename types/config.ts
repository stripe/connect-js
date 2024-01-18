/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-vars */

type CollectionOptions = {
  fields: "currently_due" | "eventually_due";
  futureRequirements?: "omit" | "include";
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
    setOnExit: (_listener: (() => void) | undefined): void => {}
  },
  "payment-details": {
    setPayment: (_payment: string | undefined): void => {},
    setOnClose: (_listener: (() => void) | undefined): void => {}
  }
};
