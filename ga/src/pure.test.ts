/* eslint-disable @typescript-eslint/no-var-requires */

import type { IStripeConnectInitParams } from "./exportedTypes/shared";
import { SCRIPT_SELECTOR } from "./utils/jestHelpers";
import type { LoadConnectAndInitialize } from "./exportedTypes/shared";

const flushPromises = async () => {
  for (let i = 0; i < 10; i++) {
    await Promise.resolve();
  }
};

describe("component loading errors", () => {
  const initParams: IStripeConnectInitParams = {
    publishableKey: "pk_test_example",
    fetchClientSecret: async () => "example_secret",
  };
  let loadConnectAndInitialize: LoadConnectAndInitialize;

  beforeEach(() => {
    loadConnectAndInitialize = require("./pure").loadConnectAndInitialize;
  });

  afterEach(() => {
    delete (window as any).StripeConnect;
  });

  test.each(["injected", "existing"])(
    "reports %s script failures to every component",
    async (source) => {
      if (source === "existing") {
        const script = document.createElement("script");
        script.src = "https://connect-js.stripe.com/v1.0/connect.js";
        document.head.appendChild(script);
      }
      const instance = loadConnectAndInitialize(initParams);
      const payments = instance.create("payments");
      const balances = instance.create("balances");
      const onPaymentsError = jest.fn();
      const onBalancesError = jest.fn();
      payments.setOnLoadError(onPaymentsError);
      payments.setDefaultFilters(undefined);
      payments.setOnLoaderStart(jest.fn());
      balances.setOnLoadError(onBalancesError);
      instance.update({ locale: "en" });

      expect(document.querySelector(SCRIPT_SELECTOR)).not.toBe(null);
      document
        .querySelector(SCRIPT_SELECTOR)!
        .dispatchEvent(new Event("error"));
      await flushPromises();

      expect(onPaymentsError).toHaveBeenCalledTimes(1);
      expect(onPaymentsError).toHaveBeenCalledWith({
        elementTagName: "stripe-connect-payments",
        error: { type: "render_error", message: "Failed to load Connect.js" },
      });
      expect(onBalancesError).toHaveBeenCalledTimes(1);
      expect(onBalancesError).toHaveBeenCalledWith({
        elementTagName: "stripe-connect-balances",
        error: { type: "render_error", message: "Failed to load Connect.js" },
      });
      await expect(instance.logout()).rejects.toThrow(
        "Failed to load Connect.js"
      );
    }
  );

  test.each([
    ["missing objects", "Connect.js did not load the necessary objects"],
    ["script injection", "Script injection failed"],
    ["initialization", "Initialization failed"],
  ])("reports %s failures", async (failure, message) => {
    const fail = () => {
      throw new Error(message);
    };
    if (failure === "script injection") {
      jest.spyOn(document.head, "appendChild").mockImplementation(fail);
    } else if (failure === "initialization") {
      (window as any).StripeConnect = { init: fail };
    }
    const element = loadConnectAndInitialize(initParams).create("payments");
    const onLoadError = jest.fn();
    element.setOnLoadError(onLoadError);
    if (failure === "missing objects") {
      document.querySelector(SCRIPT_SELECTOR)!.dispatchEvent(new Event("load"));
    }
    await flushPromises();

    expect(onLoadError).toHaveBeenCalledWith({
      elementTagName: "stripe-connect-payments",
      error: { type: "render_error", message },
    });
  });

  test("supports components and listeners created after failure", async () => {
    const instance = loadConnectAndInitialize(initParams);
    document.querySelector(SCRIPT_SELECTOR)!.dispatchEvent(new Event("error"));
    await flushPromises();

    const element = instance.create("payments");
    const removedListener = jest.fn();
    element.setOnLoadError(removedListener);
    element.setOnLoadError(undefined);
    await flushPromises();
    expect(removedListener).not.toHaveBeenCalled();

    const replacedListener = jest.fn();
    const onLoadError = jest.fn();
    element.setOnLoadError(replacedListener);
    element.setOnLoadError(onLoadError);
    expect(onLoadError).not.toHaveBeenCalled();
    await flushPromises();
    expect(replacedListener).not.toHaveBeenCalled();
    expect(onLoadError).toHaveBeenCalledTimes(1);
  });

  test("forwards setters and callbacks when loading succeeds", async () => {
    const connector = {};
    const update = jest.fn();
    const logout = jest.fn().mockResolvedValue(undefined);
    (window as any).StripeConnect = {
      init: () => ({ connect: connector, update, logout }),
    };
    const instance = loadConnectAndInitialize(initParams);
    const element = instance.create("payments");
    const setConnector = jest.fn();
    const setOnLoadError = jest.fn();
    const setOnLoaderStart = jest.fn();
    const setDefaultFilters = jest.fn();
    Object.assign(element, {
      setConnector,
      setOnLoadErrorInternalOnly: setOnLoadError,
      setOnLoaderStartInternalOnly: setOnLoaderStart,
      setDefaultFiltersInternalOnly: setDefaultFilters,
    });
    const onLoadError = jest.fn();
    const onLoaderStart = jest.fn();
    element.setOnLoadError(onLoadError);
    element.setOnLoaderStart(onLoaderStart);
    element.setDefaultFilters({ status: ["pending"] });
    instance.update({ locale: "en" });
    await flushPromises();

    expect(setConnector).toHaveBeenCalledWith(connector);
    expect(setOnLoadError).toHaveBeenCalledWith(onLoadError);
    expect(setOnLoaderStart).toHaveBeenCalledWith(onLoaderStart);
    expect(setDefaultFilters).toHaveBeenCalledWith({ status: ["pending"] });
    expect(update).toHaveBeenCalledWith({ locale: "en" });
    expect(onLoadError).not.toHaveBeenCalled();

    element.setOnLoadError(undefined);
    await flushPromises();
    expect(setOnLoadError).toHaveBeenLastCalledWith(undefined);
    await instance.logout();
    expect(logout).toHaveBeenCalledTimes(1);
  });
});

describe("pure module", () => {
  test("does not inject the script if loadConnectAndInitialize is not called", async () => {
    require("./pure");

    expect(document.querySelector(SCRIPT_SELECTOR)).toBe(null);
  });
});
