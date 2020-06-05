const Store = require('./store').Store;
const hash = require('./hash');

let store;

function reset() {
  if (store) {
    window.removeEventListener('popstate', update);
  }
  window.addEventListener('popstate', update);
  store = new Store(hash.deserialize(location.hash), function(
    values,
    defaults
  ) {
    const nonDefaults = {};
    for (const key in values) {
      if (values[key] !== defaults[key]) {
        nonDefaults[key] = values[key];
      }
    }
    history.pushState(values, '', hash.serialize(nonDefaults));
  });
}

function update() {
  store.update(hash.deserialize(location.hash));
}

/**
 * Register a new state provider.
 * @param {Object} config Schema config.
 * @param {function(Object)} callback Called immediately with initial state.
 * @return {function(Object)} Call this function with any updates to the state.
 */
exports.register = function(config, callback) {
  return store.register(config, callback);
};

/**
 * Unregister an existing state provider.
 * @param {function(Object)} callback Callback registered by the provider.
 */
exports.unregister = function(callback) {
  store.unregister(callback);
};

/**
 * Serialize values as they would be represented in the hash.
 * @param {Object} values An object with values to be serialized.
 * @return {string} The values as they would be represented in the hash.
 */
exports.serialize = function(values) {
  return hash.serialize(store.serialize(values));
};

exports.reset = reset;

reset();
