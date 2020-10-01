'use strict';
const deepFreeze = require('./deepFreeze');
const typeOf = require('./typeOf');

/**
* Fixes the following idiom in JavaScript:
*   if (!Memory.rooms[roomName]
*       || !Memory.rooms[roomName].info
*       || !Memory.rooms[roomName].info.lastseen ) {
*     // we have never seen it
*     return 0;
*   }
*
* The problem is that the nested values might not be defined yet. One solution
* is to create all the intermediate nested objects before attempting to access
* deeply nested values, but this wastes a lot of memory if we don't need them
* again later.
*
* A better solution is to create a separate singleton object that contains all
* the default values, and dynamically reference them if they don't exist on the
* target object yet. We accomplish this using getter/setter functions.
*
* Example:
*   const makeProto = require('./util/makeProto');
*   const roomsProto = makeProto({
*     // Uses __undefinedValue__ when the key doesn't exist in the defaults.
*     __undefinedValue__: {
*       info: {
*         lastseen: null,
*         players: [],  // Arrays must be empty in the proto definition.
*       },
*     },
*   });
*   const room = roomProto(Memory.rooms[42]);
*   if (!room.info.lastseen) {
*     // we have never seen it
*     return 0;
*   }
*
* See makeProto.test.js for more usage examples.
*
* WARNING: The input object will be made immutable, so it cannot be modified.
*
* @param {Object} defaults A pure JSON object containing default values.
* @return {Function}
*/
const makeProto = (defaults) => {
  deepFreeze(defaults);
  const proxy = (data, defaults, setParent) => new Proxy(data, {
    get: (data, key) => {
      const defaultValue = key in defaults
        ? defaults[key] : defaults['__undefinedValue__'];
      const type = typeOf(defaultValue);
      if (type === 'object' || type === 'array') {
        let exists = key in data;
        const value = exists ? data[key] : (type === 'object' ? {} : []);
        const _setParent = () => {
          if (!exists) {
            setParent();
            data[key] = value;
            exists = true;
          }
        };
        return proxy(value, defaultValue, _setParent);
      } else {
        return key in data ? data[key] : defaultValue;
      }
    },
    set: (data, key, value) => {
      setParent();
      data[key] = value;
      return true;
    },
  });
  return (data) => proxy(data, defaults, () => {});
};

module.exports = makeProto;
