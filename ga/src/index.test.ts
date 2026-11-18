/* eslint-disable @typescript-eslint/no-var-requires */
import { SCRIPT_SELECTOR } from "./utils/jestHelpers";

describe("Stripe module loader", () => {
  jest.spyOn(global, "setTimeout");
  it("injects the Connect.js script as a side effect after a tick", () => {
    require("./index");

    expect(document.querySelector(SCRIPT_SELECTOR)).toBe(null);
    return Promise.resolve().then(() => {
      expect(document.querySelector(SCRIPT_SELECTOR)).not.toBe(null);
    });
  });

  it("reports script loading failures to component listeners", async () => {
    const { loadConnectAndInitialize } = require("./index");
    const instance = loadConnectAndInitialize({
      publishableKey: "pk_test_example",
      fetchClientSecret: async () => "example_secret",
    });
    const element = instance.create("payments");
    const onLoadError = jest.fn();
    element.setOnLoadError(onLoadError);
    await Promise.resolve();

    document.querySelector(SCRIPT_SELECTOR)!.dispatchEvent(new Event("error"));
    for (let i = 0; i < 10; i++) {
      await Promise.resolve();
    }

    expect(onLoadError).toHaveBeenCalledTimes(1);
    expect(onLoadError).toHaveBeenCalledWith({
      elementTagName: "stripe-connect-payments",
      error: { type: "render_error", message: "Failed to load Connect.js" },
    });
  });
});
