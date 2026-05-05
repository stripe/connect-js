export const EXISTING_SCRIPT_MESSAGE =
  "loadConnect was called but an existing Connect.js script already exists in the document; existing script parameters will be used";
const V0_URL = "https://connect-js.stripe.com/v0.1/connect.js";
const V1_URL = "https://connect-js.stripe.com/v1.0/connect.js";

export const findScript = (): HTMLScriptElement | null => {
  return (
    document.querySelectorAll<HTMLScriptElement>(
      `script[src="${V1_URL}"]`
    )[0] ||
    document.querySelectorAll<HTMLScriptElement>(
      `script[src="${V0_URL}"]`
    )[0] ||
    null
  );
};

export const injectScript = (): HTMLScriptElement => {
  const script = document.createElement("script");
  script.src = V1_URL;

  const head = document.head;

  if (!head) {
    throw new Error(
      "Expected document.head not to be null. Connect.js requires a <head> element."
    );
  }

  document.head.appendChild(script);

  return script;
};
