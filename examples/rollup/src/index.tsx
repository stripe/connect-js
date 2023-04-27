import * as React from "react";
import { loadConnect } from "@stripe/connect-js";
import { createRoot } from "react-dom/client";
import {
  ConnectPayments,
  ConnectPayouts,
  ConnectPaymentDetails,
  ConnectComponentsProvider,
} from "@stripe/react-connect-js";

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

(async () => {
  const clientSecret = await fetchClientSecret();
  const stripeConnect = await loadConnect();
  if (clientSecret) {
    const connectInstance = stripeConnect.initialize({
      publishableKey:
        "{{publishable key}}",
      clientSecret: clientSecret,
      appearance: {
        colorPrimary: "#228403",
      },
    });
    const domContainer = document.getElementById("payments");
    const root = createRoot(domContainer);
    if (connectInstance) {
      root.render(
        <ConnectComponentsProvider connectInstance={connectInstance}>
          <ConnectPayouts />
          <ConnectPayments />
          <ConnectPaymentDetails
            onClose={() => {
              console.log("closed");
            }}
            chargeId="pi_3MuO0YGac4z90jID0RJQbUpF"
            visible
          />
        </ConnectComponentsProvider>
      );
    }
  }
})();
