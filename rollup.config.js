import babel from "rollup-plugin-babel";
import ts from "rollup-plugin-typescript2";
import replace from "@rollup/plugin-replace";
import json from "@rollup/plugin-json";

import pkg from "./package.json";

const PLUGINS = [
  ts({
    tsconfigOverride: { exclude: ["**/*.test.ts"] }
  }),
  babel({
    extensions: [".ts", ".js", ".tsx", ".jsx"]
  }),
  replace({
    _VERSION: JSON.stringify(pkg.version)
  }),
  json()
];

export default [
  {
    input: "src/index.ts",
    output: [
      { file: pkg.main, format: "cjs" },
      { file: pkg.module, format: "es" }
    ],
    plugins: PLUGINS
  },
  {
    input: "src/pure.ts",
    output: [
      { file: "dist/pure.js", format: "cjs" },
      { file: "dist/pure.esm.js", format: "es" }
    ],
    plugins: PLUGINS
  }
];
