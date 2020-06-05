const Schema = require('./schema').Schema;
const util = require('./util');
const serializers = require('./serializers');

/**
 * An object backed store of string values.  Allows registering multiple state
 * providers.
 * @param {Object} values Initial serialized values.
 * @param {function(Object)} callback Called with an object of serialized
 *     values and defaults whenever a provider updates state.
 * @constructor
 */
const Store = (exports.Store = function(values, callback) {
  this._values = values;
  this._defaults = {};
  this._providers = [];
  this._callback = callback;
  this._callbackTimer = null;
});

Store.prototype._scheduleCallback = function() {
  if (this._callbackTimer) {
    clearTimeout(this._callbackTimer);
  }
  this._callbackTimer = setTimeout(this._debouncedCallback.bind(this));
};

Store.prototype._debouncedCallback = function() {
  this._callbackTimer = null;
  this._callback(this._values, this._defaults);
};

Store.prototype.update = function(values) {
  if (this._updateTimer) {
    clearTimeout(this._updateTimer);
  }
  this._updateTimer = setTimeout(this._debouncedUpdate.bind(this, values));
};

Store.prototype._debouncedUpdate = function(newValues) {
  this._updateTimer = null;
  const values = this._values;
  const providers = this._providers.slice(); // callbacks may unregister providers
  for (let i = providers.length - 1; i >= 0; --i) {
    const provider = providers[i];
    const schema = provider.schema;
    let changed = false;
    const state = {};
    schema.forEachKey(function(key, prefixed) {
      let deserialized;
      if (!(prefixed in newValues)) {
        deserialized = schema.getDefault(key);
        const serializedDefault = schema.serialize(key, deserialized);
        if (values[prefixed] !== serializedDefault) {
          changed = true;
          values[prefixed] = serializedDefault;
          state[key] = deserialized;
        }
      } else if (values[prefixed] !== newValues[prefixed]) {
        try {
          deserialized = schema.deserialize(key, newValues[prefixed]);
          values[prefixed] = newValues[prefixed];
          state[key] = deserialized;
          changed = true;
        } catch (err) {
          // invalid value, pass
        }
      }
    });
    if (changed && this._providers.indexOf(provider) >= 0) {
      provider.callback(state);
    }
  }
};

/**
 * Unregister a provider.  Deletes the provider's values from the underlying
 * store and calls the store's callback.
 * @param {Function} callback The provider's callback.
 */
Store.prototype.unregister = function(callback) {
  let removedProvider;
  this._providers = this._providers.filter(function(provider) {
    const remove = provider.callback === callback;
    if (remove) {
      removedProvider = provider;
    }
    return !remove;
  });
  if (!removedProvider) {
    throw new Error('Unable to unregister hashed state provider');
  }
  const values = this._values;
  const defaults = this._defaults;
  removedProvider.schema.forEachKey(function(key, prefixed) {
    delete values[prefixed];
    delete defaults[prefixed];
  });
  this._scheduleCallback();
};

/**
 * Register a new state provider.
 * @param {Object} config Schema config.
 * @param {function(Object)} callback Called by the store on state changes.
 * @return {function(Object)} Called by the provider on state changes.
 */
Store.prototype.register = function(config, callback) {
  const provider = {
    schema: new Schema(config),
    callback: callback
  };

  // ensure there are no conflicts with existing providers
  for (let i = 0, ii = this._providers.length; i < ii; ++i) {
    const conflicts = provider.schema.conflicts(this._providers[i].schema);
    if (conflicts) {
      throw new Error(
        'Provider already registered using the same name: ' + conflicts
      );
    }
    if (provider.callback === this._providers[i].callback) {
      throw new Error('Provider already registered with the same callback');
    }
  }

  this._providers.push(provider);
  this._initializeProvider(provider);

  return function update(state) {
    if (this._providers.indexOf(provider) === -1) {
      throw new Error('Unregistered provider attempting to update state');
    }
    const schema = provider.schema;
    let changed = false;
    const values = this._values;
    schema.forEachKey(function(key, prefixed) {
      if (key in state) {
        const serializedValue = schema.serialize(key, state[key], state);
        if (values[prefixed] !== serializedValue) {
          changed = true;
          values[prefixed] = serializedValue;
        }
      }
    });
    if (changed) {
      this._scheduleCallback();
    }
  }.bind(this);
};

/**
 * Call provider with initial values.
 * @param {Object} provider Provider to be initialized.
 */
Store.prototype._initializeProvider = function(provider) {
  const state = {};
  const defaults = {};
  const values = this._values;
  provider.schema.forEachKey(function(key, prefixed) {
    let deserializedValue;
    const deserializedDefault = provider.schema.getDefault(key);
    const serializedDefault = provider.schema.serialize(
      key,
      deserializedDefault
    );
    if (prefixed in values) {
      try {
        deserializedValue = provider.schema.deserialize(key, values[prefixed]);
      } catch (err) {
        deserializedValue = deserializedDefault;
      }
    } else {
      deserializedValue = deserializedDefault;
    }
    state[key] = deserializedValue;
    defaults[prefixed] = serializedDefault;
    values[prefixed] = provider.schema.serialize(key, deserializedValue);
  });
  for (const prefixed in defaults) {
    this._defaults[prefixed] = defaults[prefixed];
  }
  provider.callback(state);
};

/**
 * Serialize values with provider serializers where available.
 * @param {Object} values Values to be serialized.
 * @return {Object} The serialized values.
 */
Store.prototype.serialize = function(values) {
  const serialized = {};
  for (let i = 0, ii = this._providers.length; i < ii; ++i) {
    const provider = this._providers[i];
    provider.schema.forEachKey(function(key, prefixed) {
      if (prefixed in values) {
        serialized[prefixed] = provider.schema.serialize(
          key,
          values[prefixed],
          values
        );
      }
    });
  }
  for (const key in values) {
    if (!(key in serialized)) {
      const value = values[key];
      const type = util.typeOf(value);
      const serializer = serializers.get(type);
      serialized[key] = serializer(value);
    }
  }
  return serialized;
};
