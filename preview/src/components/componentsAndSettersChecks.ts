import type { ConnectElementTagName } from "../exportedTypes";
import type { ConnectElementCustomMethodConfig } from "./componentsAndSetters";

// ensure that keys of ConnectElementCustomMethodConfig are from ConnectElementTagName
export type HasType<T, Q extends T> = Q;
export type CustomMethodConfigValidation = HasType<
  ConnectElementTagName,
  keyof typeof ConnectElementCustomMethodConfig
>;
