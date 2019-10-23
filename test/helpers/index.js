const path = require('path');
const webpack = require('webpack');

const MemoryFileSystem = require('memory-fs');

// https://github.com/webpack-contrib/terser-webpack-plugin/blob/master/test/helpers
// MIT

function createCompiler(options = {}) {
  const compiler = webpack(
    Array.isArray(options)
      ? options
      : {
          mode: 'development',
          bail: true,
          cache: false,
          devtool: false,
          entry: path.resolve(__dirname, '../../example/src/index.js'),
          optimization: {
            minimize: false,
          },
          output: {
            pathinfo: false,
            path: path.resolve(__dirname, 'dist'),
            filename: '[name].js',
            chunkFilename: '[id].[name].js',
          },
          plugins: [],
          ...options,
        }
  );

  compiler.outputFileSystem = new MemoryFileSystem();

  return compiler;
}

function compile(compiler) {
  return new Promise((resolve, reject) => {
    // eslint-disable-line consistent-return
    compiler.run((err, stats) => {
      if (err) {
        return reject(err);
      }

      return resolve(stats);
    });
  });
}

function getAssets(stats, compiler) {
  const usedFs = compiler.outputFileSystem;
  const outputPath = stats.compilation.outputOptions.path;
  const assets = {};

  for (const file in stats.compilation.assets) {
    if (Object.prototype.hasOwnProperty.call(stats.compilation.assets, file)) {
      let targetFile = file;

      const queryStringIdx = targetFile.indexOf('?');

      if (queryStringIdx >= 0) {
        targetFile = targetFile.substr(0, queryStringIdx);
      }

      assets[file] = usedFs
        .readFileSync(path.join(outputPath, targetFile))
        .toString();
    }
  }

  return assets;
}

function removeCWD(str) {
  return str.split(`${process.cwd()}/`).join('');
}

function cleanErrorStack(error) {
  return removeCWD(error.toString())
    .split('\n')
    .slice(0, 2)
    .join('\n');
}

module.exports = {
  createCompiler, compile, getAssets, cleanErrorStack
}