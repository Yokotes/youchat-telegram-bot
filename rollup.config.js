import ts from "rollup-plugin-ts";

const config = {
  input: "src/index.ts",
  output: {
    file: "dist/bundle.js",
  },
  plugins: [ts()],
};

export default config;
