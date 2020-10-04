const typeOf = require('./typeOf');

test('undefined', () => {
  expect(typeOf(undefined)).toBe('undefined');
});

test('null', () => {
  expect(typeOf(null)).toBe('null');
});

test('number', () => {
  expect(typeOf(42)).toBe('number');
});

test('string', () => {
  expect(typeOf('42')).toBe('string');
});

test('array', () => {
  expect(typeOf([])).toBe('array');
});

test('object', () => {
  expect(typeOf({})).toBe('object');
});

test('function', () => {
  expect(typeOf(() => {})).toBe('function');
});
