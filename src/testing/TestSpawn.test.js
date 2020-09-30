const TestSpawn = require('./TestSpawn');

describe('make()', () => {
  test('with empty params', () => {
    const Spawn = TestSpawn.make({});
    expect(Spawn).toMatchObject({
      memory: {},
      room: {},
    });
  });

  test('with params', () => {
    const Spawn = TestSpawn.make({
      foo: 'a',
      memory: {
        bar: 'b',
        recycle: true,
      },
    });
    expect(Spawn).toMatchObject({
      foo: 'a',
      memory: {
        bar: 'b',
        recycle: true,
      },
      room: {},
    });
  });
});
