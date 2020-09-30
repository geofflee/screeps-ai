require('./testing/globals');

const CreepControl = require('./CreepControl');
const CreepPlan = require('./CreepPlan');
const TestCreep = require('./testing/TestCreep');
const TestSpawn = require('./testing/TestSpawn');

describe('recycle()', () => {
  test('triggers moveTo()', () => {
    const spawn = TestSpawn.make({
      recycleCreep: jest.fn().mockReturnValue(ERR_NOT_IN_RANGE),
    });
    const creep = TestCreep.make({
      room: {
        find: jest.fn().mockReturnValue([spawn]),
      }
    });

    expect(CreepControl.recycle(creep)).toBe(true);
    expect(creep.moveTo).toHaveBeenCalled();
  });
});

describe('runPlan()', () => {
  test('does nothing if None', () => {
    const creep = TestCreep.make({});

    expect(CreepControl.runPlan(creep, CreepPlan.NONE)).toBe(CreepPlan.NONE);
  });

  test('calls recycle()', () => {
    const recycle = jest
      .spyOn(CreepControl, 'recycle')
      .mockReturnValue(true);

    const creep = TestCreep.make({});

    expect(CreepControl.runPlan(creep, CreepPlan.RECYCLE)).toBe(CreepPlan.RECYCLE);
    expect(recycle).toHaveBeenCalled();

    recycle.mockRestore();
  });
});
