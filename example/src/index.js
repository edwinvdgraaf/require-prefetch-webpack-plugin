function loadFoo() {
  return import(/* webpackPrefetch: true */ "./foo");
}

function loadBar() {
  return import("./bar");
}

require.prefetch("./bar")

console.log('staritng countdown on..')
setTimeout(function() {
  console.log('hold on..')
  setTimeout(function() {
    loadBar().then(({ bar }) => {
      console.log('callling..');
      bar()
    });
  }, 1000);
}, 3000)



