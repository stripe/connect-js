/* eslint-disable @typescript-eslint/no-var-requires */

import { SCRIPT_SELECTOR } from "./utils/jestHelpers";

describe("pure module", () => {
  test("does not inject the script if loadConnect is not called", async () => {
    require("./pure");

    expect(document.querySelector(SCRIPT_SELECTOR)).toBe(null);
  });

  test("it injects the script if loadConnect is called", async () => {
    const { loadConnect } = require("./pure");
    loadConnect();

    expect(document.querySelector(SCRIPT_SELECTOR)).not.toBe(null);
  });
});
