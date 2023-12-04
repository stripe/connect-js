/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-vars */

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
    setOnExit: (_listener: (() => void) | undefined): void => {}
  },
  "issuing-card": {
    setDefaultCard: (_defaultCard: string | undefined): void => {},
    setCardArtFileLink: (_cardArtFileLink: string | undefined): void => {},
    setCardSwitching: (_cardSwitching: boolean | undefined): void => {}
  },
  "issuing-cards-list": {
    setCardArtFileLink: (_cardArtFileLink: string | undefined): void => {}
  }
};
