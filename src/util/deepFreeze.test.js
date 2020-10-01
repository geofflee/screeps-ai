const deepFreeze = require('./deepFreeze');

describe('non-strict mode', () => {
  test('shallow property', () => {
    const obj = {
      foo: 42,
    };
    deepFreeze(obj);
    obj.foo = 43;
    expect(obj.foo).toBe(42);
  });

  test('deep property', () => {
    const obj = {
      foo: {
        bar: 42,
      },
    };
    deepFreeze(obj);
    obj.foo.bar = 43;
    expect(obj.foo.bar).toBe(42);
  });

  test('undefined property', () => {
    const obj = {};
    deepFreeze(obj);
    obj.foo = 43;
    expect(obj.foo).toBe(undefined);
  });
});

describe('strict mode', () => {
  'use strict';

  test('shallow property', () => {
    const obj = {
      foo: 42,
    };
    deepFreeze(obj);
    expect(() => { obj.foo = 43; }).toThrow(TypeError);
  });

  test('deep property', () => {
    const obj = {
      foo: {
        bar: 42,
      },
    };
    deepFreeze(obj);
    expect(() => { obj.foo.bar = 43; }).toThrow(TypeError);
  });

  test('undefined property', () => {
    const obj = {};
    deepFreeze(obj);
    expect(() => { obj.foo = 43; }).toThrow(TypeError);
  });
});
