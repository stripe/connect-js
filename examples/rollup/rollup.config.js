const commonjs = require("@rollup/plugin-commonjs");
const babel = require("@rollup/plugin-babel");
const resolve = require("@rollup/plugin-node-resolve");
const replace = require("@rollup/plugin-replace");
const peerDepsExternalPlugin = require("rollup-plugin-peer-deps-external");
const typescript = require("@rollup/plugin-typescript");

module.exports.default = [
  {
    input: "src/index.tsx",
    output: {
      dir: "public",
      format: "esm",
    },
    plugins: [
      peerDepsExternalPlugin(),
      babel(),
      replace({
        "process.env.NODE_ENV": JSON.stringify("production"),
      }),
      resolve(),
      commonjs({
        namedExports: {
          "react-dom": ["createRoot"],
          react: ["createElement", "useLayoutEffect", "useRef", "useState"],
        },
      }),
      typescript(),
    ],
  },
];
