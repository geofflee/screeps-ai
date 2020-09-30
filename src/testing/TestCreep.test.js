const TestCreep = require('./TestCreep');

describe('make()', () => {
  test('with empty params', () => {
    const creep = TestCreep.make({});
    expect(creep).toMatchObject({
      memory: {
        control: {},
      },
      room: {},
    });
  });

  test('with params', () => {
    const creep = TestCreep.make({
      foo: 'a',
      memory: {
        bar: 'b',
        recycle: true,
      },
    });
    expect(creep).toMatchObject({
      foo: 'a',
      memory: {
        control: {},
        bar: 'b',
        recycle: true,
      },
      room: {},
    });
  });
});
