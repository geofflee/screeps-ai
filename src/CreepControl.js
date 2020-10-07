const CreepPlan = require('./CreepPlan');

const CreepControl = {
  /**
  * Go to the Source, Mineral, or Deposit, and harvest it.
  *
  * @param {Creep} creep
  * @param {Source|Mineral|Deposit} resource
  * @return {Boolean} true on success.
  */
  harvest: (creep, resource) => {
    if (creep.harvest(resource) == ERR_NOT_IN_RANGE) {
      return CreepControl.moveTo(creep, resource);
    }
    return true;
  },

  /**
  * Go to a target using standard pathfinding.
  *
  * @param {Creep} creep
  * @param {*} target
  * @return {Boolean} true on success.
  */
  moveTo: (creep, target) => {
    return creep.moveTo(target, {
      visualizePathStyle: {
        stroke: CreepPlan.color(creep.memory.control.plan),
      },
    }) == OK;
  },

  /**
  * Go to the energy source or resource and carry it.
  *
  * @param {Creep} creep
  * @param {*} resource
  * @return {Boolean} true on success.
  */
  pickup: (creep, resource) => {
    if (creep.pickup(resource) == ERR_NOT_IN_RANGE) {
      return CreepControl.moveTo(creep, resource);
    }
    return true;
  },

  /**
  * Go to nearest spawn and recycle self.
  *
  * @param {Creep} creep
  * @return {Boolean} true on success.
  */
  recycle: (creep) => {
    const targets = creep.room.find(FIND_MY_SPAWNS, {
      filter: (structure) => {
        return structure.isActive();
      },
    });
    if (targets.length > 0) {
      const spawn = targets[0];
      if (spawn.recycleCreep(creep) == ERR_NOT_IN_RANGE) {
        return CreepControl.moveTo(creep, spawn);
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
  _runPlan: (creep, plan, target) => {
    switch (plan) {
      case CreepPlan.HARVEST:
        return CreepControl.harvest(creep, target);
      case CreepPlan.PICKUP:
        return CreepControl.pickup(creep, target);
      case CreepPlan.RECYCLE:
        return CreepControl.recycle(creep);
      case CreepPlan.TRANSFER:
        return CreepControl.transfer(creep);
      case CreepPlan.UPGRADE:
        return CreepControl.upgrade(creep, target);
    }
    return false;
  },

  /**
  * Go to the creep or structure and deposit energy.
  *
  * @param {Creep} creep
  * @param {Creep|PowerCreep|Structure} target
  * @param {Number} resourceType RESOURCE_* constant
  * @param {Number} amount Optional amount, defaults to all.
  * @return {Boolean} true on success.
  */
  transfer: (creep, target, resourceType, amount) => {
    if (creep.transfer(target, resourceType, amount) == ERR_NOT_IN_RANGE) {
      return CreepControl.moveTo(creep, target);
    }
    return true;
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

  /**
  * Go to the controller and upgrade it.
  *
  * @param {Creep} creep
  * @param {StructureController} controller
  * @return {Boolean} true on success.
  */
  upgrade: (creep, controller) => {
    if (creep.upgradeController(controller) == ERR_NOT_IN_RANGE) {
      return CreepControl.moveTo(creep, controller);
    }
    return true;
  },
};

module.exports = CreepControl;
