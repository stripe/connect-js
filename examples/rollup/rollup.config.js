const babel = require("rollup-plugin-babel");
const commonjs = require("@rollup/plugin-commonjs");
const resolve = require("@rollup/plugin-node-resolve");

module.exports.default = [
  {
    input: "src/index.js",
    output: {
      dir: "public",
      format: "esm"
    },
    plugins: [
      babel({ runtimeHelpers: true }),
      resolve(),
      commonjs() 
    ]
  }
];
