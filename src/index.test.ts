/* eslint-disable @typescript-eslint/no-var-requires */
import { before, after, SCRIPT_SELECTOR } from "./utils/testHelpers";

describe("Stripe module loader", () => {
  beforeEach(() => before());
  afterEach(() => after());

  it("injects the Connect.js script as a side effect after a tick", () => {
    require("./index");

    expect(document.querySelector(SCRIPT_SELECTOR)).toBe(null);

    jest.runAllTimers();

    return Promise.resolve().then(() => {
      expect(document.querySelector(SCRIPT_SELECTOR)).not.toBe(null);
    });
  });
});
