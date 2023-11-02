# Connect.js ES Module

The [Connect.js library](https://stripe.com/docs/connect/get-started-connect-embedded-components) and its supporting API allows you to add connected account dashboard functionality to your website.
This NPM package contains initialization logic for Connect embedded components along with related types.

Calling `loadConnect` always loads the latest version of Connect.js, regardless of which version of `@stripe/connect-js` you use. Updates for this package only impact tooling around the `loadConnect` helper itself and the TypeScript type definitions provided for Connect.js. Updates do not affect runtime availability of features of Connect.js.

Note: Connect embedded components is currently still in beta. Please [contact us](https://stripe.com/docs/connect/get-started-connect-embedded-components#access) to request beta access.

## Installation

Use `npm` to install the Connect.js module:

```sh
npm install @stripe/connect-js
```

## Documentation

- [Connect embedded components](https://stripe.com/docs/connect/get-started-connect-embedded-uis)
- [Quickstart guide](https://stripe.com/docs/connect/connect-embedded-uis/quickstart)

## Usage

### `loadConnect`

This function returns a `Promise` that resolves with a newly created `StripeConnect`
object once Connect.js has loaded. If necessary, it will load Connect.js for you by inserting the Connect.js script tag.

The `stripeConnect.initialize` function returns a `ConnectInstance` once you initialize it with a publishable key and a client secret returned from the [Account Session API](https://stripe.com/docs/api/account_sessions/create) call.

```js
import { loadConnect } from "@stripe/connect-js";

const stripeConnect = await loadConnect();
const connectInstance = stripeConnect.initialize({
  publishableKey: "{{pk test123}}",
  clientSecret: "{{client secret}}",
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

### Manually include the script tag

Manually add the Connect.js script tag to the `<head>` of each page on your site.
If an existing script tag is already present, this module will not insert a new
one. When you call `loadConnect`, it will use the existing script tag.

```html
<!-- Somewhere in your site's <head> -->
<script src="https://connect-js.stripe.com/v0.1/connect.js" async></script>
```

### Importing `loadConnect` without side effects

If you would like to use `loadConnect` in your application, but defer loading the
Connect.js script until `loadConnect` is first called, use the alternative
`@stripe/connect-js/pure` import path:

```js
import { loadConnect } from "@stripe/connect-js/pure";

// Connect.js will not be loaded until `loadConnect` is called
const stripeConnect = await loadConnect();
```
