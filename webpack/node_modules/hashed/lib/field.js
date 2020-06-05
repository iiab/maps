const util = require('./util');

const serializers = require('./serializers');
const deserializers = require('./deserializers');

/**
 * Create a new field.  A field must have a default value (`default`) and is
 * capable of serializing and deserializing values.
 * @param {Object} config Field configuration.  Must have a `default` property
 *     with a default value.  May have optional `serialize` and `deserialize`
 *     functions.  As a shorthand for providing a config object with a `default`
 *     property, a default value may be provided directly.
 * @constructor
 */
exports.Field = function(config) {
  if (util.typeOf(config) !== 'object') {
    this.default = config;
  } else if (!('default' in config)) {
    throw new Error('Missing default');
  } else {
    this.default = config.default;
  }

  const type = util.typeOf(this.default);
  this.serialize = config.serialize || serializers.get(type);
  this.deserialize = config.deserialize || deserializers.get(type);
};
