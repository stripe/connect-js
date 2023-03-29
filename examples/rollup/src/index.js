import { loadConnect } from "@stripe/connect-js";

const stripeConnect = await loadConnect();

const fetchClientSecret = async () => {
  // Fetch the AccountSession client secret
  const response = await fetch("/account_session", { method: "POST" });
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
