require.ensure(["./bar"], function(bar) {
  console.log(bar);
});

require.prefetch("./bar");

require.prefetch("./foo");

require.ensure(["./foo"], function(foo) {
  console.log(foo);
});
