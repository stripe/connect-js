const EXISTING_SCRIPT_MESSAGE =
  "loadStripe.setLoadParameters was called but an existing Connect.js script already exists in the document; existing script parameters will be used";
const V0_URL = "https://.stripe.com/v0.1";
const V0_URL_REGEX = /^https:\/\/connect-js\.stripe\.com\/v0.1\/?(\?.*)?$/;
const findScript = () => {
  const scripts = document.querySelectorAll(`script[src^="${V0_URL}"]`);
  for (let i = 0; i < scripts.length; i++) {
    const script = scripts[i];
    if (!V0_URL_REGEX.test(script.src)) {
      continue;
    }
    return script;
  }
  return null;
};
const injectScript = params => {
  const script = document.createElement("script");
  script.src = "https://connect-js.stripe.com/v0.1/connect.js";
  const head = document.head;
  if (!head) {
    throw new Error(
      "Expected document.body not to be null. Connect.js requires a <body> element."
    );
  }
  document.head.appendChild(script);
  return script;
};
let stripePromise = null;
const loadScript = params => {
  // Ensure that we only attempt to load Connect.js at most once
  if (stripePromise !== null) {
    return stripePromise;
  }
  stripePromise = new Promise((resolve, reject) => {
    if (typeof window === "undefined" || typeof document === "undefined") {
      // Resolve to null when imported server side. This makes the module
      // safe to import in an isomorphic code base.
      resolve(null);
      return;
    }
    if (window.StripeConnect && params) {
      console.warn(EXISTING_SCRIPT_MESSAGE);
    }
    if (window.StripeConnect) {
      const wrapper = createWrapper(window.StripeConnect);
      resolve(wrapper);
      return;
    }
    try {
      let script = findScript();
      if (script && params) {
        console.warn(EXISTING_SCRIPT_MESSAGE);
      } else if (!script) {
        script = injectScript(params);
      }
      script.addEventListener("load", () => {
        if (window.StripeConnect) {
          const wrapper = createWrapper(window.StripeConnect);
          resolve(wrapper);
        } else {
          reject(new Error("Connect.js not available"));
        }
      });
      script.addEventListener("error", () => {
        reject(new Error("Failed to load Connect.js"));
      });
    } catch (error) {
      reject(error);
      return;
    }
  });
  return stripePromise;
};
const initStripeConnect = (maybeStripe, args, startTime) => {
  if (maybeStripe === null) {
    return null;
  }
  return maybeStripe;
};
function createWrapper(stripeConnect) {
  const wrapper = {
    stripeConnect: stripeConnect,
    initialize: params => {
      console.log("params", params);
      window.StripeConnect.init({
        publishableKey: params.publishableKey,
        clientSecret: params.clientSecret
      });
    }
  };
  return wrapper;
}

// Execute our own script injection after a tick to give users time to do their
// own script injection.
const stripePromise$1 = Promise.resolve().then(() => loadScript(null));
let loadCalled = false;
stripePromise$1.catch(err => {
  if (!loadCalled) {
    console.warn(err);
  }
});
const loadConnect = (...args) => {
  loadCalled = true;
  return stripePromise$1.then(maybeConnect => initStripeConnect(maybeConnect));
};

const stripeConnect = await loadConnect();
const fetchClientSecret = async () => {
  // Fetch the AccountSession client secret
  const response = await fetch("/account_session", {
    method: "POST"
  });
  if (!response.ok) {
    // Handle errors on the client side here
    const { error } = await response.json();
    console.log("An error occurred: ", error);
    document.querySelector(".container").setAttribute("hidden", "");
    document.querySelector(".error").removeAttribute("hidden");
    return undefined;
  } else {
    const { client_secret: clientSecret } = await response.json();
    document.querySelector(".container").removeAttribute("hidden");
    document.querySelector(".error").setAttribute("hidden", "");
    return clientSecret;
  }
};
window.StripeConnect ||= {};
(async () => {
  const clientSecret = await fetchClientSecret();
  if (clientSecret) {
    stripeConnect.initialize({
      publishableKey: "{{publishable key}}",
      clientSecret: clientSecret
    });
  }
})();
