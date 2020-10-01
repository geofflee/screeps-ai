'use strict';
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

describe('getter', () => {
  test('undefined', () => {
    const proto = makeProto({});
    const data = {};
    expect(proto(data).foo).toBe(undefined);
  });

  test('null', () => {
    const proto = makeProto({
      foo: null,
    });
    const data = {};
    expect(proto(data).foo).toBeNull();
  });

  test('number', () => {
    const proto = makeProto({
      foo: 42,
    });
    const data = {};
    expect(proto(data).foo).toBe(42);
  });

  test('string', () => {
    const proto = makeProto({
      foo: '42',
    });
    const data = {};
    expect(proto(data).foo).toBe('42');
  });

  test('nested object', () => {
    const proto = makeProto({
      foo: {
        bar:  42,
      },
    });
    const data = {};
    expect(proto(data).foo.bar).toBe(42);
  });

  test('nested object undefined', () => {
    const proto = makeProto({
      foo: {},
    });
    const data = {};
    expect(proto(data).foo.bar).toBeUndefined();
  });

  test('deep nested object', () => {
    const proto = makeProto({
      foo: {
        bar: {
          baz: 42,
        },
      },
    });
    const data = {};
    expect(proto(data).foo.bar.baz).toBe(42);
  });

  test('deep nested object undefined', () => {
    const proto = makeProto({
      foo: {
        bar: {},
      },
    });
    const data = {};
    expect(proto(data).foo.bar.baz).toBeUndefined();
  });

  test('array', () => {
    const proto = makeProto({
      foo: [],
    });
    const data = {};
    expect(proto(data).foo.length).toBe(0);
  });
});

describe('setter', () => {
  test('undefined', () => {
    const proto = makeProto({});
    const data = {};
    proto(data).foo = 42;
    expect(data.foo).toBe(42);
    expect(proto(data).foo).toBe(42);
  });

  test('null', () => {
    const proto = makeProto({
      foo: null,
    });
    const data = {};
    proto(data).foo = 42;
    expect(data.foo).toBe(42);
    expect(proto(data).foo).toBe(42);
  });

  test('number', () => {
    const proto = makeProto({
      foo: 1,
    });
    const data = {};
    proto(data).foo = 42;
    expect(data.foo).toBe(42);
    expect(proto(data).foo).toBe(42);
  });

  test('string', () => {
    const proto = makeProto({
      foo: '1',
    });
    const data = {};
    proto(data).foo = '42';
    expect(data.foo).toBe('42');
    expect(proto(data).foo).toBe('42');
  });

  test('nested object', () => {
    const proto = makeProto({
      foo: {
        bar: 1,
      },
    });
    const data = {};
    proto(data).foo.bar = 42;
    expect(data.foo.bar).toBe(42);
    expect(proto(data).foo.bar).toBe(42);
  });

  test('nested object undefined', () => {
    const proto = makeProto({
      foo: {},
    });
    const data = {};
    proto(data).foo.bar = 42;
    expect(data.foo.bar).toBe(42);
    expect(proto(data).foo.bar).toBe(42);
  });

  test('deep nested object', () => {
    const proto = makeProto({
      foo: {
        bar: {
          baz: 1,
        },
      },
    });
    const data = {};
    proto(data).foo.bar.baz = 42;
    expect(data.foo.bar.baz).toBe(42);
    expect(proto(data).foo.bar.baz).toBe(42);
  });

  test('deep nested object undefined', () => {
    const proto = makeProto({
      foo: {
        bar: {},
      },
    });
    const data = {};
    proto(data).foo.bar.baz = 42;
    expect(data.foo.bar.baz).toBe(42);
    expect(proto(data).foo.bar.baz).toBe(42);
  });

  test('array bracket operator', () => {
    const proto = makeProto({
      foo: [],
    });
    const data = {};
    proto(data).foo[0] = 1;
    proto(data).foo[1] = 42;
    expect(data.foo.length).toBe(2);
    expect(data.foo[0]).toBe(1);
    expect(data.foo[1]).toBe(42);
    expect(proto(data).foo).toEqual(expect.arrayContaining([1, 42]));
  });

  test('array push', () => {
    const proto = makeProto({
      foo: [],
    });
    const data = {};
    proto(data).foo.push(1);
    proto(data).foo.push(42);
    expect(data.foo.length).toBe(2);
    expect(data.foo[0]).toBe(1);
    expect(data.foo[1]).toBe(42);
    expect(proto(data).foo).toEqual(expect.arrayContaining([1, 42]));
  });
});
