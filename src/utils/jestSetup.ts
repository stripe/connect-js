import { SCRIPT_SELECTOR } from "./jestHelpers";

global.beforeEach(() => {
  jest.spyOn(console, "warn").mockReturnValue();
  jest.useFakeTimers();
});

global.afterEach(() => {
  const script = document.querySelector(SCRIPT_SELECTOR);
  if (script && script.parentElement) {
    script.parentElement.removeChild(script);
  }
  jest.resetModules();
  jest.restoreAllMocks();
  jest.runOnlyPendingTimers();
  jest.useRealTimers();
});
