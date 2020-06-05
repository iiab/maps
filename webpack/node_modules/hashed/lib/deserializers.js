const util = require('./util');

const dec = decodeURIComponent;

const noop = function() {};

const deserializers = {
  string: function(str) {
    if (!str || typeof str !== 'string') {
      throw new Error('Expected string to deserialize: ' + str);
    }
    return dec(str);
  },
  number: function(str) {
    if (!str || typeof str !== 'string') {
      throw new Error('Expected string to deserialize: ' + str);
    }
    const num = Number(dec(str));
    if (isNaN(num)) {
      throw new Error('Expected to deserialize a number: ' + str);
    }
    return num;
  },
  boolean: function(str) {
    if (!str || typeof str !== 'string') {
      throw new Error('Expected string to deserialize: ' + str);
    }
    let bool;
    if (str === '1') {
      bool = true;
    } else if (str === '0') {
      bool = false;
    } else {
      throw new Error('Expected "1" or "0" for boolean: ' + str);
    }
    return bool;
  },
  date: function(str) {
    if (!str || typeof str !== 'string') {
      throw new Error('Expected string to deserialize: ' + str);
    }
    const date = new Date(dec(str));
    if (isNaN(date.getTime())) {
      throw new Error('Expected to deserialize a date: ' + str);
    }
    return date;
  },
  array: function(str) {
    if (!str || typeof str !== 'string') {
      throw new Error('Expected string to deserialize: ' + str);
    }
    let array;
    try {
      array = JSON.parse(dec(str));
    } catch (err) {
      noop();
    }
    if (!array || util.typeOf(array) !== 'array') {
      throw new Error('Expected to deserialize an array: ' + str);
    }
    return array;
  },
  object: function(str) {
    if (!str || typeof str !== 'string') {
      throw new Error('Expected string to deserialize: ' + str);
    }
    let obj;
    try {
      obj = JSON.parse(dec(str));
    } catch (err) {
      noop();
    }
    if (!obj || util.typeOf(obj) !== 'object') {
      throw new Error('Expected to deserialize an object: ' + str);
    }
    return obj;
  }
};

/**
 * Get a deserializer for a value of the given type.
 * @param {string} type Value type.
 * @return {function(string): *} Function that deserializes a string to a value.
 */
exports.get = function(type) {
  if (!(type in deserializers)) {
    throw new Error('Unable to deserialize type: ' + type);
  }
  return deserializers[type];
};
