const CreepPlan = require('./CreepPlan');

test('all enums have colors', () => {
  Object.values(CreepPlan.enums).forEach((plan) => {
    expect(CreepPlan.colors).toEqual(expect.objectContaining({
      [plan]: expect.any(String),
    }));
  });
});

test('all enums have names', () => {
  Object.values(CreepPlan.enums).forEach((plan) => {
    expect(CreepPlan.names).toEqual(expect.objectContaining({
      [plan]: expect.any(String),
    }));
  });
});

test('color()', () => {
  expect(CreepPlan.color(CreepPlan.NONE)).toEqual('#000000');
});

test('name()', () => {
  expect(CreepPlan.name(CreepPlan.NONE)).toEqual('NONE');
});
