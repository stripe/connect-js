# Connect.js ES Module

The [Connect.js library](https://stripe.com/docs/connect/get-started-connect-embedded-components) and its supporting API allows you to add connected account dashboard functionality to your website.
This NPM package contains initialization logic for Connect embedded components along with related types.

Calling `loadConnectAndInitialize` always loads the latest version of Connect.js, regardless of which version of `@stripe/connect-js` you use. Updates for this package only impact tooling around the `loadConnectAndInitialize` helper itself and the TypeScript type definitions provided for Connect.js. Updates do not affect runtime availability of features of Connect.js.

The embedded onboarding component is generally available now. Please refer to our [documentation](https://stripe.com/docs/connect/get-started-connect-embedded-components#account-onboarding) for more information.

Note: Majority of Connect embedded components are currently still in beta. Please [contact us](https://stripe.com/docs/connect/get-started-connect-embedded-components#access) to request beta access.

## Installation

Use `npm` to install the Connect.js module:

```sh
npm install @stripe/connect-js
```

## Documentation

- [Connect embedded components](https://stripe.com/docs/connect/get-started-connect-embedded-components)
- [Quickstart guide for GA](https://stripe.com/docs/connect/connect-embedded-components/quickstart)
- [Quickstart guide for beta](https://stripe.com/docs/connect/connect-embedded-components/beta-quickstart)

## Usage

### `loadConnectAndInitialize`

This synchronous function takes in a publishable key, a function to retrieve the client secret returned from the [Account Session API](https://stripe.com/docs/api/account_sessions/create), and other [initialization parameters](https://stripe.com/docs/connect/get-started-connect-embedded-components#configuring-connect-js). It returns a `StripeConnectInstance`. If necessary, it will load Connect.js for you by inserting the Connect.js script tag.

```js
import { loadConnectAndInitialize } from "@stripe/connect-js";
const fetchClientSecret = async () => {
  // Fetch the AccountSession client secret by making an API call to your service
};

const instance = loadConnectAndInitialize({
  publishableKey: "{{pk test123}}",
  fetchClientSecret: fetchClientSecret
});
```

We’ve placed a random API key in this example. Replace it with your
[actual publishable API keys](https://dashboard.stripe.com/account/apikeys) to
test this code through your Connect account.

If you have deployed a
[Content Security Policy](https://developer.mozilla.org/en-US/docs/Web/Security/CSP),
make sure to
[include Connect.js in your directives](https://stripe.com/docs/security/guide#content-security-policy).

### Import as a side effect

Import `@stripe/connect-js` as a side effect in code that will be included
throughout your site (e.g. your root module). This will make sure the Connect.js
script tag is inserted immediately upon page load.

```js
import "@stripe/connect-js";
```

### Importing `loadConnectAndInitialize` without side effects

If you would like to use `loadConnectAndInitialize` in your application, but defer loading the
Connect.js script until `loadConnectAndInitialize` is first called, use the alternative
`@stripe/connect-js/pure` import path:

```js
import { loadConnectAndInitialize } from "@stripe/connect-js/pure";

// Connect.js will not be loaded until `loadConnect` is called
const instance = loadConnectAndInitialize({
  publishableKey: "{{pk test123}}",
  fetchClientSecret: fetchClientSecret
});
```
