/* eslint-disable @typescript-eslint/no-var-requires */

const SCRIPT_SELECTOR =
  'script[src^="https://connect-js.stripe.com/v0.1/connect.js"]';

describe("pure module", () => {
  beforeEach(() => {
    jest.spyOn(console, "warn").mockReturnValue();
  });

  afterEach(() => {
    const scripts = Array.from(document.querySelectorAll(SCRIPT_SELECTOR));

    for (const script of scripts) {
      if (script.parentElement) {
        script.parentElement.removeChild(script);
      }
    }

    jest.resetModules();
    jest.restoreAllMocks();
  });

  test("does not inject the script if loadStripe is not called", async () => {
    require("./pure");

    expect(document.querySelector(SCRIPT_SELECTOR)).toBe(null);
  });

  test("it injects the script if loadStripe is called", async () => {
    const { loadConnect } = require("./pure");
    loadConnect();

    expect(document.querySelector(SCRIPT_SELECTOR)).not.toBe(null);
  });
});
