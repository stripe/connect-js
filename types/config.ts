/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-vars */

export type CollectionOptions = {
  fields: "currently_due" | "eventually_due";
  futureRequirements?: "omit" | "include";
};

export type Status =
  | "blocked"
  | "canceled"
  | "disputed"
  | "early_fraud_warning"
  | "failed"
  | "incomplete"
  | "partially_refunded"
  | "pending"
  | "refund_pending"
  | "refunded"
  | "successful"
  | "uncaptured";

export type PaymentMethod =
  | "ach_credit_transfer"
  | "ach_debit"
  | "acss_debit"
  | "affirm"
  | "afterpay_clearpay"
  | "alipay"
  | "alma"
  | "amazon_pay"
  | "amex_express_checkout"
  | "android_pay"
  | "apple_pay"
  | "au_becs_debit"
  | "nz_bank_account"
  | "bancontact"
  | "bacs_debit"
  | "bitcoin_source"
  | "bitcoin"
  | "blik"
  | "boleto"
  | "boleto_pilot"
  | "card_present"
  | "card"
  | "cashapp"
  | "crypto"
  | "customer_balance"
  | "demo_pay"
  | "dummy_passthrough_card"
  | "gbp_credit_transfer"
  | "google_pay"
  | "eps"
  | "fpx"
  | "giropay"
  | "grabpay"
  | "ideal"
  | "id_bank_transfer"
  | "id_credit_transfer"
  | "jp_credit_transfer"
  | "interac_present"
  | "kakao_pay"
  | "klarna"
  | "konbini"
  | "kr_card"
  | "kr_market"
  | "link"
  | "masterpass"
  | "mb_way"
  | "meta_pay"
  | "multibanco"
  | "mobilepay"
  | "naver_pay"
  | "netbanking"
  | "ng_bank"
  | "ng_bank_transfer"
  | "ng_card"
  | "ng_market"
  | "ng_ussd"
  | "vipps"
  | "oxxo"
  | "p24"
  | "payto"
  | "pay_by_bank"
  | "paper_check"
  | "payco"
  | "paynow"
  | "paypal"
  | "pix"
  | "promptpay"
  | "revolut_pay"
  | "samsung_pay"
  | "sepa_credit_transfer"
  | "sepa_debit"
  | "sofort"
  | "south_korea_market"
  | "swish"
  | "three_d_secure"
  | "three_d_secure_2"
  | "three_d_secure_2_eap"
  | "twint"
  | "upi"
  | "us_bank_account"
  | "visa_checkout"
  | "wechat"
  | "wechat_pay"
  | "zip";

export type PaymentsListDefaultFilters = {
  amount?:
    | { equals: number }
    | { greaterThan: number }
    | { lessThan: number }
    | { between: { lowerBound: number; upperBound: number } };
  date?:
    | { before: Date }
    | { after: Date }
    | { between: { start: Date; end: Date } };
  status?: Array<Status>;
  paymentMethod?: PaymentMethod;
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
  payments: {
    setDefaultFilters: (
      _filters: PaymentsListDefaultFilters | undefined
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
