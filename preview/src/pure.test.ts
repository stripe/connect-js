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
    "reports %s script failures even if fetching the client secret fails",
    async (source) => {
      if (source === "existing") {
        const script = document.createElement("script");
        script.src = "https://connect-js.stripe.com/v1.0/connect.js";
        document.head.appendChild(script);
      }
      const instance = loadConnectAndInitialize({
        ...initParams,
        fetchClientSecret: () =>
          Promise.reject(new Error("Secret fetch failed")),
      });
      const payments = instance.create("payments");
      const balances = instance.create("balances");
      const onPaymentsError = jest.fn();
      const onBalancesError = jest.fn();
      payments.setOnLoadError(onPaymentsError);
      payments.setDefaultFilters(undefined);
      payments.setOnLoaderStart(jest.fn());
      balances.setOnLoadError(onBalancesError);
      instance.update({ locale: "en" });

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

  test("reports missing objects after the script loads", async () => {
    const element = loadConnectAndInitialize(initParams).create("payments");
    const onLoadError = jest.fn();
    element.setOnLoadError(onLoadError);

    document.querySelector(SCRIPT_SELECTOR)!.dispatchEvent(new Event("load"));
    await flushPromises();

    expect(onLoadError).toHaveBeenCalledWith({
      elementTagName: "stripe-connect-payments",
      error: {
        type: "render_error",
        message: "Connect.js did not load the necessary objects",
      },
    });
  });

  test("reports script injection failures", async () => {
    jest.spyOn(document.head, "appendChild").mockImplementation(() => {
      throw new Error("Script injection failed");
    });
    const element = loadConnectAndInitialize(initParams).create("payments");
    const onLoadError = jest.fn();
    element.setOnLoadError(onLoadError);
    await flushPromises();

    expect(onLoadError).toHaveBeenCalledWith({
      elementTagName: "stripe-connect-payments",
      error: { type: "render_error", message: "Script injection failed" },
    });
  });

  test("reports initialization failures", async () => {
    (window as any).StripeConnect = {
      init: () => {
        throw new Error("Initialization failed");
      },
    };
    const element = loadConnectAndInitialize(initParams).create("payments");
    const onLoadError = jest.fn();
    element.setOnLoadError(onLoadError);
    await flushPromises();

    expect(onLoadError).toHaveBeenCalledWith({
      elementTagName: "stripe-connect-payments",
      error: { type: "render_error", message: "Initialization failed" },
    });
  });

  test("reports errors while preparing the loaded script", async () => {
    const element = loadConnectAndInitialize(initParams).create("payments");
    const onLoadError = jest.fn();
    element.setOnLoadError(onLoadError);
    (window as any).StripeConnect = Object.freeze({ init: jest.fn() });

    document.querySelector(SCRIPT_SELECTOR)!.dispatchEvent(new Event("load"));
    await flushPromises();

    expect(onLoadError).toHaveBeenCalledTimes(1);
    expect(onLoadError.mock.calls[0]![0].error.type).toBe("render_error");
  });

  test("supports components and listeners created after failure", async () => {
    const instance = loadConnectAndInitialize(initParams);
    document.querySelector(SCRIPT_SELECTOR)!.dispatchEvent(new Event("error"));
    await flushPromises();

    const element = instance.create("payments");
    await flushPromises();
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

  test.each(["upgrade", "connector", "setter"])(
    "reports component %s failures",
    async (failure) => {
      (window as any).StripeConnect = { init: () => ({ connect: {} }) };
      const element = loadConnectAndInitialize(initParams).create("payments");
      if (failure !== "upgrade") {
        (element as any).setConnector = () => {
          if (failure === "connector") {
            throw new Error("Connector failed");
          }
        };
      }
      const onLoadError = jest.fn();
      element.setOnLoadError(onLoadError);
      await flushPromises();

      expect(onLoadError).toHaveBeenCalledTimes(1);
      expect(onLoadError.mock.calls[0]![0]).toMatchObject({
        elementTagName: "stripe-connect-payments",
        error: { type: "render_error" },
      });
    }
  );

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

  test("it injects the script if loadConnectAndInitialize is called", async () => {
    const { loadConnectAndInitialize } = require("./pure");
    const mockInitParams: IStripeConnectInitParams = {
      publishableKey: "pk_123",
      fetchClientSecret: async () => {
        return "secret_123";
      },
    };
    loadConnectAndInitialize(mockInitParams);

    expect(document.querySelector(SCRIPT_SELECTOR)).not.toBe(null);
  });
});
