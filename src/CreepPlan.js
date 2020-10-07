const Enums = {
  NONE: 0,
  HARVEST: 1,
  PICKUP: 2,
  RECYCLE: 3,
  TRANSFER: 4,
  UPGRADE: 5,
};

// Enum class containing CreepControl plans.
const CreepPlan = {
  ...Enums,

  // Maps enums to UI colors.
  colors: {
    [Enums.NONE]: '#000000',
    [Enums.HARVEST]: '#FFAA00',
    [Enums.PICKUP]: '#FFAA00',
    [Enums.RECYCLE]: '#FFC0CB',
    [Enums.TRANSFER]: '#FFAA00',
    [Enums.UPGRADE]: '#0091EA',
  },

  // A copy of the enums for convenience.
  enums: Enums,

  // Maps enums to human-readable strings.
  names: {
    [Enums.NONE]: 'NONE',
    [Enums.HARVEST]: 'HARVEST',
    [Enums.PICKUP]: 'PICKUP',
    [Enums.RECYCLE]: 'RECYCLE',
    [Enums.TRANSFER]: 'TRANSFER',
    [Enums.UPGRADE]: 'UPGRADE',
  },

  /**
  * Returns a hex color code for this CreepPlan enum.
  *
  * @param {Integer} plan CreepPlan enum
  * @return {String}
  */
  color: (plan) => CreepPlan.colors[plan] || '#FFFFFF',

  /**
  * Returns a human-readable name for this CreepPlan enum.
  *
  * @param {Integer} plan CreepPlan enum
  * @return {String}
  */
  name: (plan) => CreepPlan.names[plan] || `Plan(${plan})`,
};

module.exports = CreepPlan;
