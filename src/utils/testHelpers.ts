export const SCRIPT_SELECTOR =
  'script[src^="https://connect-js.stripe.com/v0.1/connect.js"]';

export const before = (): void => {
  jest.spyOn(console, "warn").mockReturnValue();
  jest.useFakeTimers();
};

export const after = (): void => {
  const script = document.querySelector(SCRIPT_SELECTOR);
  if (script && script.parentElement) {
    script.parentElement.removeChild(script);
  }
  jest.resetModules();
  jest.restoreAllMocks();
  jest.runOnlyPendingTimers();
  jest.useRealTimers();
};
