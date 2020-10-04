'use strict';
const runOnce = require('./runOnce');
const typeOf = require('./typeOf');

const makeType = (type) => {
  switch (type) {
    case 'object':
      return {};
    case 'array':
      return [];
    default:
      throw Error('Unexpected type: ' + type);
  }
};

// Lookup table of special properties and methods of the proxy object.
const specialProperties = {
  // Returns a function that outputs true if `key` exists in data or defaults.
  has: (data, defaults) => {
    return (key) => {
      return key in defaults || key in data;
    }
  },
  // Returns a reference to the underlying data object.
  rawData: (data, defaults) => {
    return data;
  },
}

/**
* If `key` doesn't exist in the underlying data object, then the output value
* of this function is returned to the proxy's caller.
*
* @param {Object} data
* @param {String} key
* @param {Object|Array} defaults
* @return {*}
*/
const getDefaultValue = (data, key, defaults) => {
  if (key in defaults) {
    return defaults[key];
  } else if (key in specialProperties) {
    const func = specialProperties[key];
    func.__isMakeProtoInternal = true;
    return func;
  } else {
    return defaults['__undefinedValue__'];
  }
}

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
* You can also create an array with default values. This is an example of a
* 2-dimensional array with default value of 0.
*   const proto = makeProto({
*     grid: defaultArray(defaultArray(0)),
*   });
*   const data = {};
*   const proxy = proto(data);
*   proxy.grid[0][0] = 42;
*   console.log(proxy.grid[0][0]);  // 42
*   console.log(proxy.grid[1][0]);  // 0
*
* You can check if a property has been explicitly set in the data object:
*
*   const proto = makeProto({
*     foo: 42,
*   });
*   const data = {};
*   const proxy = proto(data);
*   console.log(proxy.has('foo'));  // false
*   proxy.foo = 42;
*   console.log(proxy.has('foo'));  // true, even if value is same as default.
*
* And you can fetch the proxy's underlying data object with the `rawData`
* property:
*
*   console.log(proxy.rawData === data);  // true
*
* See makeProto.test.js for more usage examples.
*
* @param {Object} defaults A pure JSON object containing default values.
* @return {Function}
*/
const makeProto = (defaults) => {
  /**
  * This function wraps the data object and its nested objects with a JavaScript
  * Proxy, which allows us to intercept all property and method calls.
  */
  const proxy = (data, defaults, setParent) => new Proxy(data, {
    // A getter function that intercepts reads to a property on this object.
    get: (data, key) => {
      // This is the value we return if `key` is not in `data`.
      const defaultValue = getDefaultValue(data, key, defaults);

      const type = typeOf(defaultValue);
      if (type === 'object' || type === 'array') {
        const value = key in data ? data[key] : makeType(type);
        /**
        * If `key` doesn't exist in the data object yet, we return a new empty
        * object/array. However, we don't want to assign this empty object/array
        * to its respective parent until there's actually data stored in it.
        * So instead, we create this function to do a retroactive assignment and
        * pass it to the setter function for later use.
        */
        const deferredSetParent = runOnce(() => {
          if (!(key in data)) {
            setParent();
            data[key] = value;
          }
        });
        return proxy(value, defaultValue, deferredSetParent);
      } else if (key in data) {
        return data[key];
      } else if (type === 'function' && defaultValue.__isMakeProtoInternal) {
        return defaultValue(data, key, defaults);
      } else {
        return defaultValue;
      }
    },

    // A setter function that intercepts writes to a property on this object.
    set: (data, key, value) => {
      setParent();  // Call deferredSetParent() from the getter function.
      data[key] = value;
      return true;
    },

    // This intercepts calls with the `in` operator on this object.
    has: (data, key) => {
      return key in data || key in defaults;
    },

    /**
    * Merge property descriptors and prevent internal properties from being
    * enumerated.
    */
    getOwnPropertyDescriptor: (data, key) => {
      const descriptor = Reflect.getOwnPropertyDescriptor(data, key)
        || Reflect.getOwnPropertyDescriptor(defaults, key);
      if (key === '__undefinedValue__' && !(key in data)) {
        descriptor.enumerable = false;
      }
      return descriptor;
    },

    /**
    * Returns this object's keys when called using `Object.keys(proxy)`.
    */
    ownKeys: (data) => {
      if (typeOf(data) === 'array') {
        return Reflect.ownKeys(data);
      } else {
        return Array.from(new Set([
          ...Reflect.ownKeys(defaults),
          ...Reflect.ownKeys(data),
        ]));
      }
    },
  });

  return (data) => proxy(data, defaults, () => {});
};

module.exports = makeProto;
