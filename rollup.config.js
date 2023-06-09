import ts from "rollup-plugin-ts";
import pkg from "./package.json" assert { type: "json" };

const config = {
  input: "src/index.ts",
  output: {
    file: "api/index.js",
  },
  plugins: [ts()],
  external: [...Object.keys(pkg.dependencies), "fs"],
};

export default config;
