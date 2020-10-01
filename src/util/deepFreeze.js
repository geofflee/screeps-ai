const typeOf = require('./typeOf');

/**
* Makes an entire object or array read-only, including nested objects.
*
* WARNING: other references to nested objects will also be frozen.
*
* @param {Object|Array} obj
* @return {Object|Array}
*/
const deepFreeze = (obj) => {
  if (typeOf(obj) !== 'object' && typeOf(obj) !== 'array') {
    throw Error(`Cannot freeze ${typeOf(obj)}.`);
  }
  for (const key of Object.getOwnPropertyNames(obj)) {
    const value = obj[key];
    if (value !== null && typeof value === 'object') {
      deepFreeze(value);
    }
  }
  return Object.freeze(obj);
}

module.exports = deepFreeze;
