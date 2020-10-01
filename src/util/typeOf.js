const typeOf = (value) => {
  if (value === null) {
    return 'null';
  } else if (Array.isArray(value)) {
    return 'array';
  } else {
    return typeof value;
  }
}

module.exports = typeOf;
