import { loadConnect } from "@stripe/connect-js";

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

const clientSecret = await fetchClientSecret();
const stripeConnect = await loadConnect();
if (clientSecret) {
  const connectInstance = stripeConnect.initialize({
    publishableKey: "",
    clientSecret: clientSecret,
    appearance: {
      variables: {
        colorPrimary: "#FF3333",
      },
    }
  });
  const onboarding = connectInstance.create("account-onboarding");
  document.getElementById("onboarding").append(onboarding);
  connectInstance.update({
    appearance: {
      variables: {
        colorPrimary: "#7F3D73",
      },
    },
  });
}
