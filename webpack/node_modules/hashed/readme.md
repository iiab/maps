# `hashed`

Serialize your application state in the URL hash.

Hashed lets you register any number of providers and serializes their state in the URL hash.  When your application loads (or if the URL changes by other means), the providers will be notified of the new state.

## Setup

Install `hashed` with [`npm`](https://nodejs.org/).

In your project root:

    npm install hashed --save

In one of your application modules:

```js
const hashed = require('hashed');
```

## Examples

### Single provider, default serializers and deserializers

The simplest use of hashed is to register a single state provider.  This example uses the built-in functions for transforming state values to strings for the URL (serializing) and transforming strings from the URL into state values (deserializing).

```js
const state = {
  count: 42,
  color: 'blue'
};

function listener(newState) {
  // called when the state in the URL is different than what we have
}

// register a state provider
const update = hashed.register(state, listener);

// When the state of your application changes, update the hash.
update({count: 43}); // URL hash will become #/count/43/color/blue
```

### Single provider, custom serializers and deserializers

The default serializers and deserializers work for primitive state values (string, boolean, number).  Dates will be serialized as ISO strings (and deserialized from the same).  Arrays and objects will be serialized with `JSON.stringify()` and deserialized with `JSON.parse()`.  You can override this behavior if you want to have prettier URLs or to serialize complex or cyclic data.

```js
// Assume your state has a "colors" array and
// you don't want JSON serialization in the URL.
const config = {
  colors: {
    default: [] // no colors by default
    serialize: function(colors) {
      // Instead of JSON, you want comma delimited values.
      // Note that if you expect strings that should be encoded,
      // use encodeURIComponent here.
      return colors.join(',');
    },
    deserialize: function(string) {
      // Note that if you use encodeURIComponent above in serialize,
      // you should use decodeURIComponent here.
      return string.split(',');
    }
  }
};

// register a state provider
const update = hashed.register(config, function(state) {
  // this will get called with a "colors" array
});

update(['green', 'blue']); // URL hash will become #/colors/green,blue
```

## API

### `hashed.register`

The `hashed` module exports a `register` function that is to be called by components that want to initialize their state by deserializing values from the URL hash or persist their state by serializing values to the URL hash.  Multiple components (that may not know about one another) can register for "slots" in the hash.

The `register` function takes two arguments:

 * **config** - `Object` Definition for the state "schema" (default values and types for each field).  The `config` object takes two forms, depending on whether or not you want the default serializers and deserializers.

  Without custom serializers or deserializers, the config is an objects with property values representing the default state.  For example, if your state is represented by a "start" date of Jan 1, 2000 and a "count" value of 42, your `config` would look like this:

  ```js
  const config = {
    start: new Date(Date.UTC(2000, 0, 1)),
    count: 42
  };
  ```

  If you don't want to use the build-in functions for serializing and deserializing values, use an object with `default`, `serialize`, and `deserialize` properties.  The `default` value represents the default value (if none is present in the URL).  The `serialize` function is called with your state value and returns a string for the URL.  The `deserialize` function is called with a string and returns the value for your state.

 * **listener** - `function(Object)` A function that is called when the URL hash is updated.  The object properties represent new state values.  The object will not include property values that have not changed.

The `register` function returns a function:

 * `function(Object)` A function that should be called whenever a component's state changes.  The URL hash will be updated with serialized versions of the state values.

### `hashed.unregister`

The `unregister` function is to stop synchronizing state with the URL hash.  It should be called with the same `listener` function passed to the `register` function.

![Test Status](https://github.com/tschaub/hashed/workflows/Test/badge.svg)
