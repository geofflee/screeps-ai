/**
* Helper function for defining arrays with default values in makeProto().
*
* Example:
*   const defaultArray = require('./util/defaultArray');
*   const makeProto = require('./util/makeProto');
*
* @param {*} defaultValue The array's default value.
* @return {Array}
*/
const defaultArray = (defaultValue) => {
  const arr = [];
  arr.__undefinedValue__ = defaultValue;
  return arr;
};

module.exports = defaultArray;
