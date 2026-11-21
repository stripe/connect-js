import {
  connectElementTagNames,
  ConnectElementCustomMethodConfig,
} from "./componentsAndSetters";

describe("Payment Method Settings", () => {
  it("registers the GA component and its configuration setter", () => {
    expect(connectElementTagNames).toContain("payment-method-settings");
    expect(ConnectElementCustomMethodConfig).toHaveProperty(
      "payment-method-settings.setPaymentMethodConfiguration",
      expect.any(Function)
    );
  });
});
