/* eslint-disable @typescript-eslint/no-var-requires */

import { assert } from "conditional-type-checks";
import type { IsExact } from "conditional-type-checks";
import type {
  ConnectHTMLElementRecord,
  IntervalType,
  IStripeConnectInitParams,
  ReportName,
  StripeConnectInstance,
} from "./exportedTypes";
import { initStripeConnect } from "./init";
import { SCRIPT_SELECTOR } from "./utils/jestHelpers";

describe("reporting chart", () => {
  test("exports the supported report names and intervals", () => {
    assert<IsExact<ReportName, "gross_volume" | "net_volume">>(true);
    assert<IsExact<IntervalType, "day" | "week" | "month">>(true);
    assert<
      IsExact<
        Pick<
          ConnectHTMLElementRecord["reporting-chart"],
          | "setReportName"
          | "setIntervalStart"
          | "setIntervalEnd"
          | "setIntervalType"
          | "setHeight"
        >,
        {
          setReportName: (reportName: ReportName) => void;
          setIntervalStart: (intervalStart: Date | undefined) => void;
          setIntervalEnd: (intervalEnd: Date | undefined) => void;
          setIntervalType: (intervalType: IntervalType | undefined) => void;
          setHeight: (height: string | undefined) => void;
        }
      >
    >(true);
  });

  test("creates a chart and forwards its setters after initialization", async () => {
    const element = Object.assign(document.createElement("div"), {
      setConnector: jest.fn(),
      setReportNameInternalOnly: jest.fn(),
      setIntervalStartInternalOnly: jest.fn(),
      setIntervalEndInternalOnly: jest.fn(),
      setIntervalTypeInternalOnly: jest.fn(),
      setHeightInternalOnly: jest.fn(),
    });
    const createElement = jest
      .spyOn(document, "createElement")
      .mockReturnValueOnce(element);
    const runtimeInstance: StripeConnectInstance = {
      create: jest.fn(),
      update: jest.fn(),
      logout: jest.fn(),
    };
    const instance = initStripeConnect(
      Promise.resolve({ initialize: () => runtimeInstance }),
      {
        publishableKey: "pk_test_example",
        fetchClientSecret: async () => "example_client_secret",
      }
    );
    const chart = instance.create("reporting-chart");
    const start = new Date("2026-01-01T00:00:00Z");
    const end = new Date("2026-02-01T00:00:00Z");

    chart.setReportName("gross_volume");
    chart.setReportName("net_volume");
    chart.setIntervalStart(start);
    chart.setIntervalEnd(end);
    chart.setIntervalType("day");
    chart.setIntervalType("week");
    chart.setIntervalType("month");
    chart.setHeight("400px");
    chart.setHeight("100%");

    expect(element.setHeightInternalOnly).not.toHaveBeenCalled();
    await instance.debugInstance();

    expect(createElement).toHaveBeenCalledWith(
      "stripe-connect-reporting-chart"
    );
    expect(chart).toBe(element);
    expect(element.setConnector).toHaveBeenCalledTimes(1);
    expect(element.setReportNameInternalOnly.mock.calls).toEqual([
      ["gross_volume"],
      ["net_volume"],
    ]);
    expect(element.setIntervalStartInternalOnly).toHaveBeenCalledWith(start);
    expect(element.setIntervalEndInternalOnly).toHaveBeenCalledWith(end);
    expect(element.setIntervalTypeInternalOnly.mock.calls).toEqual([
      ["day"],
      ["week"],
      ["month"],
    ]);
    expect(element.setHeightInternalOnly.mock.calls).toEqual([
      ["400px"],
      ["100%"],
    ]);

    chart.setIntervalStart(undefined);
    chart.setIntervalEnd(undefined);
    chart.setIntervalType(undefined);
    chart.setHeight(undefined);
    await instance.debugInstance();

    expect(element.setIntervalStartInternalOnly).toHaveBeenLastCalledWith(
      undefined
    );
    expect(element.setIntervalEndInternalOnly).toHaveBeenLastCalledWith(
      undefined
    );
    expect(element.setIntervalTypeInternalOnly).toHaveBeenLastCalledWith(
      undefined
    );
    expect(element.setHeightInternalOnly).toHaveBeenLastCalledWith(undefined);
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
