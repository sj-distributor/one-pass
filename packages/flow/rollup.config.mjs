import { readFileSync } from "node:fs";

import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";
import dts from "rollup-plugin-dts";
import postcss from "rollup-plugin-postcss";

const pkg = JSON.parse(readFileSync("./package.json"));

const inputFile = "./src/index.ts";

const baseConfig = {
  input: inputFile,
  external: ["react", "react-dom", "@xyflow/react", "ramda", "ahooks"],
  watch: {
    buildDelay: 500,
  },
};

const bundleConfig = {
  ...baseConfig,
  output: [
    { file: pkg.main, format: "cjs", sourcemap: true },
    { file: pkg.module, format: "esm", sourcemap: true },
  ],
  plugins: [
    resolve(),
    commonjs(),
    typescript({
      declaration: false,
      declarationDir: undefined,
    }),
    postcss(),
  ],
};

const dtsConfig = {
  ...baseConfig,
  output: { file: pkg.types, format: "esm" },
  plugins: [resolve(), postcss({ inject: false, extract: true }), dts()],
};

export default [bundleConfig, dtsConfig];
