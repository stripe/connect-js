/* eslint-disable @typescript-eslint/no-var-requires */
import { before, after, SCRIPT_SELECTOR } from "./utils/testHelpers";

describe("pure module", () => {
  beforeEach(() => before());
  afterEach(() => after());

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
