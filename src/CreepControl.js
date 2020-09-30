const CreepPlan = require('./CreepPlan');

const CreepControl = {
  /**
  * Go to nearest spawn and recycle self.
  *
  * @param {Creep} creep
  * @return {Boolean} true on success.
  */
  recycle: (creep) => {
    const targets = creep.room.find(FIND_STRUCTURES, {
      filter: (structure) => {
        return structure.structureType == STRUCTURE_SPAWN
          && structure.my() && structure.isActive();
      },
    });
    if (targets.length > 0) {
      const spawn = targets[0];
      if (spawn.recycleCreep(creep) == ERR_NOT_IN_RANGE) {
        creep.moveTo(spawn, {
          visualizePathStyle: {
            stroke: CreepPlan.color(creep.memory.control.plan),
          },
        });
      }
    } else {
      // TODO: Go to nearest room with spawn.
      console.error('Remote recycling not implemented yet.');
      return false;
    }
    return true;
  },

  /**
  * Executes a CreepPlan on this creep.
  *
  * @param {Creep} creep
  * @param {Integer} plan CreepPlan enum
  * @return {Integer} Current plan, or CreepPlan.NONE if failed.
  */
  runPlan: (creep, plan) => {
    creep.memory.control.plan = plan;
    if (!CreepControl._runPlan(creep, plan)) {
      creep.memory.control.plan = CreepPlan.NONE;
    }
    return creep.memory.control.plan;
  },

  // Helper function.
  _runPlan: (creep, plan) => {
    switch (plan) {
      case CreepPlan.RECYCLE:
        return CreepControl.recycle(creep);
    }
    return false;
  },

  /**
  * A short string describing this creep.
  *
  * @param {Creep} creep
  * @return {String}
  */
  toShortString: (creep) => {
    const room = creep.room.name;
    const name = creep.name;
    const plan = CreepPlan.name(creep.memory.control.plan);
    return `${room} ${plan} ${name}`;
  },
};

module.exports = CreepControl;
