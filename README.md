# Require prefetch webpack plugin

This plugin adds the ablility to prefechting module chunks on demand, this can be usefull where
chunks have a high certainty to be used after a certain action.

## Example

```
function loadBar() {
  return import("./bar");
}

require.prefetch("./bar")
```

## License

This plugin is released under the MIT License.