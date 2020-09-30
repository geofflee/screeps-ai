const Enums = {
  NONE: 0,
  RECYCLE: 1,
};

// Enum class containing CreepControl plans.
const CreepPlan = {
  ...Enums,

  // Maps enums to UI colors.
  colors: {
    [Enums.NONE]: '#000000',
    [Enums.RECYCLE]: '#FFC0CB',
  },

  // A copy of the enums for convenience.
  enums: Enums,

  // Maps enums to human-readable strings.
  names: {
    [Enums.NONE]: 'NONE',
    [Enums.RECYCLE]: 'RECYCLE',
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
