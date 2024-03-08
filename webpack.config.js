const path = require("path"); // funzione fornita da Node.js

module.exports = {
  mode: "development",
  entry: "./src/index.js", // file iniziale letto da webpack
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "build"),
    clean: true,
    assetModuleFilename: "[path][name][ext]",
  },
};
