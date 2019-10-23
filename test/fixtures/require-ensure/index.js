require.ensure(["./bar"], function(bar) {
  console.log(bar);
});

require.prefetch("./bar")
