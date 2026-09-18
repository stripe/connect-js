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
});
