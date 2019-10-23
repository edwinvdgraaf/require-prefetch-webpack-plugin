const path = require('path');
const RequirePrefetchPlugin = require('../lib/');

module.exports = {
  mode: "development",
  devtool: false,
  entry: path.join(__dirname, 'src'),
  plugins: [new RequirePrefetchPlugin()],
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    compress: true,
    port: 9000,
    hot: false,
    inline: false
  }
}