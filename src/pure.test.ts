/* eslint-disable @typescript-eslint/no-var-requires */

import { IStripeConnectInitParams } from "../types";
import { SCRIPT_SELECTOR } from "./utils/jestHelpers";

describe("pure module", () => {
  test("does not inject the script if loadConnectAndInitialize is not called", async () => {
    require("./pure");

    expect(document.querySelector(SCRIPT_SELECTOR)).toBe(null);
  });

  test("it injects the script if loadConnectAndInitialize is called", async () => {
    const { loadConnectAndInitialize } = require("./pure");
    const mockInitParams: IStripeConnectInitParams = {
      publishableKey: "pk_123",
      fetchClientSecret: async () => {
        return "secret_123";
      }
    };
    loadConnectAndInitialize(mockInitParams);

    expect(document.querySelector(SCRIPT_SELECTOR)).not.toBe(null);
  });
});
