'use strict';
const defaultArray = require('./defaultArray');
const makeProto = require('./makeProto');

test('basic example 1', () => {
  const Memory = {
    rooms: {
      'bar': {
        info: {
          lastseen: 20200930,
        },
      },
    },
  };
  const roomsProto = makeProto({
    // Uses __undefinedValue__ when the key doesn't exist in the defaults.
    __undefinedValue__: {
      info: {
        lastseen: null,
        players: [],  // Arrays must be empty in the proto definition.
      },
    },
  });

  // Arbitrary test function.
  const hasBeenSeen = (id) => {
    const rooms = roomsProto(Memory.rooms);
    if (!rooms[id].info.lastseen) {
      return false;
    } else {
      rooms[id].info.players.push('Geofflee');
      return true;
    }
  }

  // Memory.rooms has no value for 'foo', so hasBeenSeen() returns false.
  expect(hasBeenSeen('foo')).toBe(false);

  // But it does have a value for 'bar', so hasBeenSeen() returns true
  // and appends to the array.
  expect(hasBeenSeen('bar')).toBe(true);
  expect(Memory.rooms['bar'].info.players[0]).toBe('Geofflee');
});

test('basic example 2', () => {
  const proto = makeProto({
    info: {
      foo: 42,
      bar: [],  // Arrays must be empty in the proto definition.
    },
  });
  const data = {
    info: {
      fizz: true,
    },
  };
  const proxy = proto(data);
  if (proxy.info.foo == 42 && proxy.info.fizz) {
    proxy.info.bar.push('buzz');
  }
  expect(data.info.bar).toEqual(expect.arrayContaining(['buzz']));
});

describe('get', () => {
  test('simple literals', () => {
    const proto = makeProto({
      a: null,
      b: 42,
      c: '42',
      d: true,
      e: undefined,
    });
    const data = {};
    const proxy = proto(data);
    expect(proxy.a).toBeNull();
    expect(proxy.b).toBe(42);
    expect(proxy.c).toBe('42');
    expect(proxy.d).toBe(true);
    expect(proxy.e).toBe(undefined);
    expect(proxy.f).toBe(undefined);
  });

  test('nested object', () => {
    const proto = makeProto({
      a: {
        b:  42,
      },
    });
    const data = {};
    const proxy = proto(data);
    expect(proxy.a.b).toBe(42);
    expect(proxy.a.c).toBeUndefined();
  });

  test('deeply nested object', () => {
    const proto = makeProto({
      a: {
        b: {
          c: 42,
        },
      },
    });
    const data = {};
    const proxy = proto(data);
    expect(proxy.a.b.c).toBe(42);
    expect(proxy.a.b.d).toBeUndefined();
  });

  test('array', () => {
    const proto = makeProto({
      foo: [],
    });
    const data = {};
    const proxy = proto(data);
    expect(proxy.foo.length).toBe(0);
  });
});

describe('set', () => {
  test('simple literals', () => {
    const proto = makeProto({});
    const data = {};
    const proxy = proto(data);
    proxy.a = null;
    proxy.b = 42;
    proxy.c = '42';
    proxy.d = true;
    proxy.e = undefined;
    expect(data.a).toBe(null);
    expect(proxy.a).toBe(null);
    expect(data.b).toBe(42);
    expect(proxy.b).toBe(42);
    expect(data.c).toBe('42');
    expect(proxy.c).toBe('42');
    expect(data.d).toBe(true);
    expect(proxy.d).toBe(true);
    expect(data.e).toBe(undefined);
    expect(proxy.e).toBe(undefined);
  });

  test('nested object', () => {
    const proto = makeProto({
      a: {
        b: 1,
      },
    });
    const data = {};
    const proxy = proto(data);
    proxy.a.b = 11;
    proxy.a.c = 22;
    expect(data.a.b).toBe(11);
    expect(proxy.a.b).toBe(11);
    expect(data.a.c).toBe(22);
    expect(proxy.a.c).toBe(22);
  });

  test('deeply nested object', () => {
    const proto = makeProto({
      a: {
        b: {
          c: 1,
        },
      },
    });
    const data = {};
    const proxy = proto(data);
    proxy.a.b.c = 11;
    proxy.a.b.d = 22;
    expect(data.a.b.c).toBe(11);
    expect(proxy.a.b.c).toBe(11);
    expect(data.a.b.d).toBe(22);
    expect(proxy.a.b.d).toBe(22);
  });

  test('array bracket operator', () => {
    const proto = makeProto({
      foo: [],
    });
    const data = {};
    const proxy = proto(data);
    proxy.foo[0] = 1;
    proxy.foo[1] = 42;
    expect(data.foo.length).toBe(2);
    expect(data.foo[0]).toBe(1);
    expect(data.foo[1]).toBe(42);
    expect(proxy.foo).toEqual(expect.arrayContaining([1, 42]));
  });

  test('array push', () => {
    const proto = makeProto({
      foo: [],
    });
    const data = {};
    const proxy = proto(data);
    proxy.foo.push(1);
    proxy.foo.push(42);
    expect(data.foo.length).toBe(2);
    expect(data.foo[0]).toBe(1);
    expect(data.foo[1]).toBe(42);
    expect(proxy.foo).toEqual(expect.arrayContaining([1, 42]));
  });
});

describe('in', () => {
  test('simple property', () => {
    const proto = makeProto({
      a: 1,
    });
    const data = {
      b: 2,
    };
    const proxy = proto(data);
    // Only exists in proto.
    expect('a' in proxy).toBe(true);
    // Only exists in data.
    expect('b' in proxy).toBe(true);
    // Doesn't exist in either.
    expect('c' in proxy).toBe(false);
  });

  test('nested property', () => {
    const proto = makeProto({
      foo: {
        a: 1,
      },
    });
    const data = {
      foo: {
        b: 2,
      },
    };
    const proxy = proto(data);
    // Only exists in proto.
    expect('a' in proxy.foo).toBe(true);
    // Only exists in data.
    expect('b' in proxy.foo).toBe(true);
    // Doesn't exist in either.
    expect('c' in proxy.foo).toBe(false);
  });

  test('deeply nested property', () => {
    const proto = makeProto({
      foo: {
        bar: {
          a: 1,
        },
      },
    });
    const data = {
      foo: {
        bar: {
          b: 2,
        },
      },
    };
    const proxy = proto(data);
    // Only exists in proto.
    expect('a' in proxy.foo.bar).toBe(true);
    // Only exists in data.
    expect('b' in proxy.foo.bar).toBe(true);
    // Doesn't exist in either.
    expect('c' in proxy.foo.bar).toBe(false);
  });
});

describe('delete', () => {
  test('simple literals', () => {
    const proto = makeProto({
      a: 1,
    });
    const obj = {
      a: 2,
      b: 3,
    };
    const proxy = proto(obj);

    delete proxy.a;
    expect(proxy.a).toBe(1);
    expect(obj.a).toBeUndefined();

    delete proxy.b;
    expect(proxy.b).toBeUndefined();
  });

  test('nested object', () => {
    const proto = makeProto({
      a: {
        b: 1,
      },
    });
    const obj = {
      a: {
        b: 2,
        c: 3,
      },
    };
    const proxy = proto(obj);

    delete proxy.a.b;
    expect(proxy.a.b).toBe(1);
    expect(obj.a.b).toBeUndefined();

    delete proxy.a.c;
    expect(proxy.a.c).toBeUndefined();
    expect(obj.a.b).toBeUndefined();

    delete proxy.a;
    expect(proxy.a.b).toBe(1);
    expect(proxy.a.c).toBeUndefined();
    expect(obj.a).toBeUndefined();
  });

  test('deeply nested object', () => {
    const proto = makeProto({
      a: {
        b: {
          c: 1,
        },
      },
    });
    const obj = {
      a: {
        b: {
          c: 2,
          d: 3,
        },
      },
    };
    const proxy = proto(obj);

    delete proxy.a.b.c;
    expect(proxy.a.b.c).toBe(1);
    expect(obj.a.b.c).toBeUndefined();

    delete proxy.a.b.d;
    expect(proxy.a.b.d).toBeUndefined();
    expect(obj.a.b.d).toBeUndefined();

    delete proxy.a;
    expect(proxy.a.b.c).toBe(1);
    expect(proxy.a.b.d).toBeUndefined();
    expect(obj.a).toBeUndefined();
  });
});

describe('enumeration', () => {
  test('for in', () => {
    const proto = makeProto({
      a: 1,
      b: 2,
      foo: {
        z: 10,
      },
    });
    const obj = {
      b: 2.5,
      c: 3,
    };
    const proxy = proto(obj);
    const keys = [];
    for (const key in proxy) {
      keys.push(key);
    }
    expect(keys).toEqual(['a', 'b', 'foo', 'c']);
  });

  test('Object.entries', () => {
    const proto = makeProto({
      a: 1,
      b: 2,
    });
    const obj = {
      b: 2.5,
      c: 3,
    };
    const proxy = proto(obj);
    const keys = [];
    const values = [];
    for (const [key, value] of Object.entries(proxy)) {
      keys.push(key);
      values.push(value);
    }
    expect(keys).toEqual(['a', 'b', 'c']);
    expect(values).toEqual([1, 2.5, 3]);
  });

  test('Object.keys', () => {
    const proto = makeProto({
      a: 1,
      b: 2,
      foo: {
        z: 10,
      },
    });
    const obj = {
      b: 2.5,
      c: 3,
    };
    const proxy = proto(obj);
    expect(Object.keys(proxy)).toEqual(
      expect.arrayContaining(['a', 'b', 'foo', 'c']));
  });

  test('Object.values', () => {
    const proto = makeProto({
      a: 1,
      b: 2,
    });
    const obj = {
      b: 2.5,
      c: 3,
    };
    const proxy = proto(obj);
    expect(Object.values(proxy)).toEqual([1, 2.5, 3]);
  });
});

describe('Array enumeration', () => {
  test('for in', () => {
    const proto = makeProto({
      foo: [],
    });
    const obj = {
      foo: ['a', 'b', 'c'],
    };
    const proxy = proto(obj);
    const keys = [];
    for (const key in proxy.foo) {
      keys.push(key);
    }
    expect(keys).toEqual(['0', '1', '2']);
  });

  test('for of', () => {
    const proto = makeProto({
      foo: [],
    });
    const obj = {
      foo: ['a', 'b', 'c'],
    };
    const proxy = proto(obj);
    const values = [];
    for (const value of proxy.foo) {
      values.push(value);
    }
    expect(values).toEqual(['a', 'b', 'c']);
  });

  test('Array.prototype.keys()', () => {
    const proto = makeProto({
      foo: [],
    });
    const obj = {
      foo: ['a', 'b', 'c'],
    };
    const proxy = proto(obj);
    // Array.prototype.keys returns an Array Iterator, not an Array.
    expect([...proxy.foo.keys()]).toEqual([0, 1, 2]);
  });
});

test('Array of objects', () => {
  const defaults = {
    foo: [],
  };
  defaults.foo.__undefinedValue__ = {
    a: 1,
  };
  const proto = makeProto(defaults);
  const obj = {};
  const proxy = proto(obj);
  proxy.foo.push({});
  expect(proxy.foo[0].a).toEqual(1);
});

test('Array of arrays', () => {
  const proto = makeProto({
    // A 2-dimensional array with default value 0.
    grid: defaultArray(defaultArray(0)),
  });
  const obj = {};
  const proxy = proto(obj);
  proxy.grid[0][0] = 1;
  expect(proxy.grid[0][0]).toEqual(1);
  expect(proxy.grid[1][0]).toEqual(0);
});

describe('Lookup table enumeration', () => {
  test('for in', () => {
    const proto = makeProto({
      __undefinedValue__: {
        a: 1,
      },
    });
    const obj = {
      foo: {},
      bar: {
        a: 2,
      },
    };
    const proxy = proto(obj);
    const keys = [];
    for (const key in proxy) {
      keys.push(key);
    }
    expect(keys).toEqual(['foo', 'bar']);
  });

  test('Object.entries()', () => {
    const proto = makeProto({
      __undefinedValue__: {
        a: 1,
      },
    });
    const obj = {
      foo: {},
      bar: {
        a: 2,
      },
    };
    const proxy = proto(obj);
    const keys = [];
    const values = [];
    for (const [key, value] of Object.entries(proxy)) {
      keys.push(key);
      values.push(value);
    }
    expect(keys).toEqual(['foo', 'bar']);
    expect(values).toEqual([{a: 1}, {a: 2}]);
  });

  test('Object.keys()', () => {
    const proto = makeProto({
      __undefinedValue__: {
        a: 1,
      },
    });
    const obj = {
      foo: {},
      bar: {
        a: 2,
      },
    };
    const proxy = proto(obj);
    const keys = [];
    for (const key of Object.keys(proxy)) {
      keys.push(key);
    }
    expect(keys).toEqual(['foo', 'bar']);
  });

  test('Object.values()', () => {
    const proto = makeProto({
      __undefinedValue__: {
        a: 1,
      },
    });
    const obj = {
      foo: {},
      bar: {
        a: 2,
      },
    };
    const proxy = proto(obj);
    const values = [];
    for (const value of Object.values(proxy)) {
      values.push(value);
    }
    expect(values).toEqual([{a: 1}, {a: 2}]);
  });
});

test('has', () => {
  const proto = makeProto({
    foo: {
      bar: {
        a: 1,
      },
      b: 2,
    },
    c: 3,
  });
  const data = {
    foo: {
      fizz: {
        d: 4,
      },
      e: 5,
    },
    f: 6,
  };
  const proxy = proto(data);
  expect('a' in proxy.foo.bar).toBe(true);
  expect('b' in proxy.foo).toBe(true);
  expect('c' in proxy).toBe(true);
  expect('d' in proxy.foo.fizz).toBe(true);
  expect('e' in proxy.foo).toBe(true);
  expect('f' in proxy).toBe(true);
});

test('rawData', () => {
  const proto = makeProto({
    foo: {
      a: 1,
    },
    b: 2,
  });
  const data = {
    foo: {
      c: 3,
    },
    d: 4,
  };
  const proxy = proto(data);
  proxy.foo.f = 5;
  proxy.g = 6;
  const rawData = proxy.rawData;
  expect(proxy.rawData).toBe(data);
  expect(proxy.rawData.foo.a).toBeUndefined();
  expect(proxy.rawData.b).toBeUndefined();
  expect(proxy.rawData.foo.f).toBe(5);
  expect(proxy.rawData.g).toBe(6);
});
