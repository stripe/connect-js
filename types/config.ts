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
    appId: string,
    state: 'INSTALLED' | 'UNINSTALLED', 
}

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
    setCardArtFileLink: (_cardArtFileLink: string | undefined): void => {},
    setCardSwitching: (_cardSwitching: boolean | undefined): void => {},
    setFetchEphemeralKey: (
      _fetchEphemeralKey: FetchEphemeralKeyFunction | undefined
    ): void => {}
  },
  "issuing-cards-list": {
    setCardArtFileLink: (_cardArtFileLink: string | undefined): void => {},
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
    setOnAppInstallStateFetched: (_listener: (({appId, state}: InstallState) => void)  | undefined): void => {},
    setOnAppInstallStateChanged: (_listener: (({appId, state}: InstallState) => void)  | undefined): void => {} 
  },
  "app-viewport": {
    setApp: (_app: string | undefined): void => {},
    setAppData: (_appData: Record<string, string> | undefined): void => {},
  },
};
