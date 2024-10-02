import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";

export default {
  input: "app.ts",
  output: {
    file: "dist/app.js",
    format: "cjs",
  },
  external: ["@aws-sdk/client-cognito-identity-provider"],
  plugins: [resolve(), commonjs(), typescript()],
};
