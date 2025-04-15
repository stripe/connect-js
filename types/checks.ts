import type { ConnectElementCustomMethodConfig } from "./config";
import type { ConnectElementTagName } from "./shared.d";

// ensure that keys of ConnectElementCustomMethodConfig are from ConnectElementTagName
export type HasType<T, Q extends T> = Q;
export type CustomMethodConfigValidation = HasType<
  ConnectElementTagName,
  keyof typeof ConnectElementCustomMethodConfig
>;
