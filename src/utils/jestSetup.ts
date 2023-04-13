export const SCRIPT_SELECTOR =
  'script[src^="https://connect-js.stripe.com/v0.1/connect.js"]';

global.beforeEach(() => {
  jest.spyOn(console, "warn").mockReturnValue();
  jest.useFakeTimers();
});

global.afterEach = () => {
  const script = document.querySelector(SCRIPT_SELECTOR);
  if (script && script.parentElement) {
    script.parentElement.removeChild(script);
  }
  jest.resetModules();
  jest.restoreAllMocks();
  jest.runOnlyPendingTimers();
  jest.useRealTimers();
};
