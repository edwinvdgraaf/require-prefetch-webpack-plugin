const path = require('path');

const { createCompiler, compile, getAssets, cleanErrorStack } = require('./helpers');
const RequirePrefetchPlugin = require('../lib');

describe("RequirePrefetchPlugin", () => {
  it("should work for example dir with ES6 imports", async () => {
    const compiler = createCompiler();
    new RequirePrefetchPlugin().apply(compiler);
    const stats = await compile(compiler);


    expect(stats.compilation.errors).toHaveLength(0);
    expect(stats.compilation.warnings).toHaveLength(0);
    expect(getAssets(stats, compiler)).toMatchSnapshot();
  });

  it("should work for example dir with require.ensure syntax", async () => {
    const compiler = createCompiler({
      entry: path.resolve(__dirname, './fixtures/require-ensure/index.js'),
    });
    new RequirePrefetchPlugin().apply(compiler);
    const stats = await compile(compiler);

    expect(stats.compilation.errors).toHaveLength(0);
    expect(stats.compilation.warnings).toHaveLength(0);
    expect(getAssets(stats, compiler)).toMatchSnapshot();
  });

  it("should be prefetechable before a call to create chunk is made", async () => {
    const compiler = createCompiler({
      entry: path.resolve(__dirname, './fixtures/order-independant/index.js'),
    });
    new RequirePrefetchPlugin().apply(compiler);
    const stats = await compile(compiler);

    expect(stats.compilation.errors).toHaveLength(0);
    expect(stats.compilation.warnings).toHaveLength(0);
    expect(getAssets(stats, compiler)).toMatchSnapshot();
  });

  it("should error when chunk is cannot be found", async () => {
    const compiler = createCompiler({
      entry: path.resolve(__dirname, './fixtures/no-async-import-for-chunk/index.js'),
    });

    new RequirePrefetchPlugin().apply(compiler);
    const stats = await compile(compiler);

    const error = stats.compilation.errors.map(cleanErrorStack);

    expect(error).toHaveLength(1);
    expect(stats.compilation.warnings).toHaveLength(0);
    expect(error).toMatchSnapshot();
  });

})