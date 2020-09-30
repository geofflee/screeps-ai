/**
* Returns true if `obj` has property `prop`.
*
* @param {Object} obj
* @param {String} prop
* @return {Boolean}
*/
const has = (obj, prop) => Object.prototype.hasOwnProperty.call(obj, prop);

module.exports = has;
