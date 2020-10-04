/**
* Augments `func` so that it only runs once. Subsequent calls do nothing and
* return undefined.
*
* @param {Function} func
* @return {Function}
*/
const runOnce = (func) => {
  let hasRun = false;
  return (...args) => {
    if (!hasRun) {
      hasRun = true;
      return func(...args);
    }
  };
};

module.exports = runOnce;
