/* eslint-disable @typescript-eslint/no-var-requires */

describe("Stripe module loader", () => {
  afterEach(() => {
    const script = document.querySelector(
      'script[src="https://connect-js.stripe.com/v0.1/connect.js"], script[src="https://connect-js.stripe.com/v0.1/connect.js"]'
    );
    if (script && script.parentElement) {
      script.parentElement.removeChild(script);
    }
    jest.resetModules();
  });

  it("injects the Stripe script as a side effect after a tick", () => {
    require("./index");

    expect(
      document.querySelector(
        'script[src="https://connect-js.stripe.com/v0.1/connect.js"]'
      )
    ).toBe(null);

    return Promise.resolve().then(() => {
      expect(
        document.querySelector(
          'script[src="https://connect-js.stripe.com/v0.1/connect.js"]'
        )
      ).not.toBe(null);
    });
  });
});
