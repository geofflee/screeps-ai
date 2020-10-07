require('./testing/globals');

const CreepControl = require('./CreepControl');
const CreepPlan = require('./CreepPlan');
const TestCreep = require('./testing/TestCreep');
const TestSpawn = require('./testing/TestSpawn');

describe('harvest()', () => {
  test('triggers moveTo()', () => {
    const resource = {};
    const creep = TestCreep.make({
      harvest: jest.fn().mockReturnValue(ERR_NOT_IN_RANGE),
      moveTo: jest.fn().mockReturnValue(OK),
    });
    expect(CreepControl.harvest(creep, resource)).toBe(true);
    expect(creep.moveTo).toHaveBeenCalled();
  });
});

describe('pickup()', () => {
  test('triggers moveTo()', () => {
    const resource = {};
    const creep = TestCreep.make({
      pickup: jest.fn().mockReturnValue(ERR_NOT_IN_RANGE),
      moveTo: jest.fn().mockReturnValue(OK),
    });
    expect(CreepControl.pickup(creep, resource)).toBe(true);
    expect(creep.moveTo).toHaveBeenCalled();
  });
});

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

describe('transfer()', () => {
  test('triggers moveTo()', () => {
    const target = {};
    const creep = TestCreep.make({
      transfer: jest.fn().mockReturnValue(ERR_NOT_IN_RANGE),
      moveTo: jest.fn().mockReturnValue(OK),
    });
    expect(CreepControl.transfer(creep, target, RESOURCE_ENERGY)).toBe(true);
    expect(creep.moveTo).toHaveBeenCalled();
  });
});

describe('upgrade()', () => {
  test('triggers moveTo()', () => {
    const controller = {};
    const creep = TestCreep.make({
      upgradeController: jest.fn().mockReturnValue(ERR_NOT_IN_RANGE),
      moveTo: jest.fn().mockReturnValue(OK),
    });
    expect(CreepControl.upgrade(creep, controller)).toBe(true);
    expect(creep.moveTo).toHaveBeenCalled();
  });
});
