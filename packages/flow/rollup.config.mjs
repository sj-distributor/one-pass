import { readFileSync } from "node:fs";

import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";
import dts from "rollup-plugin-dts";
import postcss from "rollup-plugin-postcss";

const pkg = JSON.parse(readFileSync("./package.json"));

const inputFile = "./src/index.ts";

// 公共基础配置
const baseConfig = {
  input: inputFile,
  external: ["react", "react-dom", "@xyflow/react"],
  watch: {
    buildDelay: 500,
  },
};

// 公共插件配置
const sharedPlugins = [
  resolve(),
  commonjs(),
  postcss({
    // 可在此统一配置 PostCSS 插件
    minimize: true,
    extract: true, // 提取 CSS 到独立文件
  }),
];

// 生成 TS 插件配置的工厂函数
const typescriptConfig = typescript({
  declaration: false,
  declarationDir: undefined,
});

// CJS 配置
const cjsConfig = {
  ...baseConfig,
  output: {
    file: pkg.main,
    format: "cjs",
    sourcemap: true,
  },
  plugins: [
    ...sharedPlugins,
    typescriptConfig, // 声明文件目录
  ],
};

// ESM 配置
const esmConfig = {
  ...baseConfig,
  output: {
    file: pkg.module,
    format: "esm",
    sourcemap: true,
  },
  plugins: [
    ...sharedPlugins,
    typescriptConfig, // 声明文件目录
  ],
};

// 独立类型构建配置
const dtsConfig = {
  input: inputFile,
  output: {
    file: "dist/index.d.ts", // 统一类型入口
    format: "esm",
  },
  plugins: [dts()],
};

export default [cjsConfig, esmConfig, dtsConfig];
