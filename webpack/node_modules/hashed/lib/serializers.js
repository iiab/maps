const util = require('util');

const enc = encodeURIComponent;

const serializers = {
  string: function(str) {
    if (typeof str !== 'string') {
      throw new Error('Expected string to serialize: ' + str);
    }
    return enc(str);
  },
  number: function(num) {
    if (typeof num !== 'number') {
      throw new Error('Expected number to serialize: ' + num);
    }
    return enc(String(num));
  },
  boolean: function(bool) {
    if (typeof bool !== 'boolean') {
      throw new Error('Expected boolean to serialize: ' + bool);
    }
    return bool ? '1' : '0';
  },
  date: function(date) {
    if (!util.isDate(date)) {
      throw new Error('Expected date to serialize: ' + date);
    }
    return enc(date.toISOString());
  },
  array: function(array) {
    if (!util.isArray(array)) {
      throw new Error('Expected array to serialize: ' + array);
    }
    return enc(JSON.stringify(array));
  },
  object: function(obj) {
    return enc(JSON.stringify(obj));
  }
};

/**
 * Get a serializer for a value of the given type.
 * @param {string} type Value type.
 * @return {function(*): string} Function that serializes a value to a string.
 */
exports.get = function(type) {
  if (!(type in serializers)) {
    throw new Error('Unable to serialize type: ' + type);
  }
  return serializers[type];
};
