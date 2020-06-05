const Field = require('./field').Field;
const util = require('./util');

/**
 * Create a new schema.  A schema is a collection of field definitions.
 * @param {Object} config Keys are field names, values are field configs.
 * @constructor
 */
const Schema = (exports.Schema = function(config) {
  config = util.extend({}, config);
  const fields = {};
  let prefix;
  if ('_' in config) {
    prefix = config._;
    delete config._;
  }
  for (const key in config) {
    fields[key] = new Field(config[key]);
  }
  this._prefix = prefix;
  this._fields = fields;
});

/**
 * Get the prefixed version of a key.
 * @param {string} key The key.
 * @return {string} The prefixed key.
 */
Schema.prototype.getPrefixed = function(key) {
  return this._prefix ? this._prefix + '.' + key : key;
};

/**
 * Call a callback for each field key.
 * @param {function(string, number)} callback Called with a local field key and
 *     a prefixed key.
 * @param {Object} thisArg This argument for the callback.
 */
Schema.prototype.forEachKey = function(callback, thisArg) {
  let more;
  for (const key in this._fields) {
    more = callback.call(thisArg, key, this.getPrefixed(key));
    if (more === false) {
      return;
    }
  }
};

/**
 * Serialize a value.
 * @param {string} key The key or field name.
 * @param {*} value The value to serialize.
 * @param {Object} values Additional values for providers to use when serializing.
 * @return {string} The serialized value.
 */
Schema.prototype.serialize = function(key, value, values) {
  if (!(key in this._fields)) {
    throw new Error('Unknown key: ' + key);
  }
  return this._fields[key].serialize(value, values);
};

/**
 * Deserialize a value.
 * @param {string} key The key or field name.
 * @param {string} str The serialized value.
 * @return {*} The deserialized value.
 */
Schema.prototype.deserialize = function(key, str) {
  if (!(key in this._fields)) {
    throw new Error('Unknown key: ' + key);
  }
  return this._fields[key].deserialize(str);
};

/**
 * Get the default value for a particular field.
 * @param {string} key The key or field name.
 * @return {*} The default value.
 */
Schema.prototype.getDefault = function(key) {
  if (!(key in this._fields)) {
    throw new Error('Unknown key: ' + key);
  }
  return this._fields[key].default;
};

/**
 * Determine if one schema conflicts with another.  Two schemas conflict if
 * any of their prefixed keys are the same.
 * @param {Schema} other The other schema.
 * @return {boolean|string} This schema conflicts with the other.  If the two
 *     schemas conflict, the return will be the first conflicting key (with
 *     any prefix).
 */
Schema.prototype.conflicts = function(other) {
  const thisPrefixedKeys = {};
  for (const key in this._fields) {
    thisPrefixedKeys[this.getPrefixed(key)] = true;
  }

  let conflicts = false;
  other.forEachKey(function(_, prefixed) {
    if (prefixed in thisPrefixedKeys) {
      conflicts = prefixed;
    }
    return !conflicts;
  });
  return conflicts;
};
