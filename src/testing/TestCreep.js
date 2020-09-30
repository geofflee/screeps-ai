const TestCreep = {
  /**
  * Returns an object that loosely follows the Creep interface.
  *
  * @param {Object} props Properties that the creep should have.
  * @return {Object}
  */
  make: (props) => ({
    // Methods
    moveTo: jest.fn(() => OK),

    // User overrides
    ...props,

    // Objects
    memory: {
      control: {},

      // User overrides
      ...props.memory,
    },
    room: {
      find: jest.fn(() => []),

      // User overrides
      ...props.room,
    },
  }),
};

module.exports = TestCreep;
