'use strict'
const runOnce = require('./runOnce');

test('runs once', () => {
  let sum = 0;
  const incrementer = runOnce((value) => {
    sum += value;
    return true;
  });
  expect(incrementer(1)).toBe(true);
  expect(sum).toBe(1);
  expect(incrementer(1)).toBeUndefined();
  expect(sum).toBe(1);
});
