import { assert } from "conditional-type-checks";
import type { IsExact } from "conditional-type-checks";
import type {
  ConnectHTMLElementRecord,
  StripeConnectInstance,
  StripeConnectWrapper,
} from "./exportedTypes";
import { initStripeConnect } from "./init";

describe("reporting-chart height", () => {
  test("exports a setter accepting strings and undefined", () => {
    type SetHeight = ConnectHTMLElementRecord["reporting-chart"]["setHeight"];

    assert<IsExact<Parameters<SetHeight>, [string | undefined]>>(true);
    assert<IsExact<ReturnType<SetHeight>, void>>(true);
  });

  test.each(["before", "after"])(
    "forwards height updates and reset %s initialization",
    async (timing) => {
      const setHeight = jest.fn();
      const element = Object.assign(
        document.createElement("stripe-connect-reporting-chart"),
        {
          setConnector: jest.fn(),
          setHeightInternalOnly: setHeight,
        }
      );
      jest.spyOn(document, "createElement").mockReturnValue(element);

      let resolveWrapper!: (wrapper: StripeConnectWrapper) => void;
      const wrapperPromise = new Promise<StripeConnectWrapper>((resolve) => {
        resolveWrapper = resolve;
      });
      const connect = initStripeConnect(wrapperPromise, {
        publishableKey: "pk_test_placeholder",
        fetchClientSecret: async () => "test_client_secret",
      });
      const instance: StripeConnectInstance = connect;
      const reportingChart: ConnectHTMLElementRecord["reporting-chart"] =
        instance.create("reporting-chart");
      const initialize = jest.fn(() => instance);

      const initializeAndWait = async () => {
        resolveWrapper({ initialize });
        await connect.debugInstance();
      };

      if (timing === "after") {
        await initializeAndWait();
      }

      reportingChart.setHeight("300px");
      reportingChart.setHeight("500px");
      reportingChart.setHeight(undefined);

      expect(setHeight).not.toHaveBeenCalled();
      if (timing === "before") {
        expect(initialize).not.toHaveBeenCalled();
        await initializeAndWait();
      }
      await Promise.resolve();

      expect(setHeight.mock.calls).toEqual([["300px"], ["500px"], [undefined]]);
      expect(setHeight.mock.instances).toEqual([element, element, element]);
      expect(element.setConnector).toHaveBeenCalledTimes(1);
    }
  );
});
