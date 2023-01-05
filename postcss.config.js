import path from "path"
import autoprefixer from "autoprefixer"

export default {
  plugins: [
    require('postcss-nested'),
    require("postcss-each"),
    require("postcss-hexrgba"),
    require("postcss-mixins")({
      mixinsFiles: path.join(__dirname, "mixins", "!(helpers.js)"),
    }),
    require("postcss-map-get"),
    autoprefixer,
  ],
}
