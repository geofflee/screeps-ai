const TestSpawn = {
  /**
  * Returns an object that loosely follows the StructureSpawn interface.
  *
  * @param {Object} props Properties that the spawn should have.
  * @return {Object}
  */
  make: (props) => ({
    // User overrides
    ...props,

    // Objects
    memory: {
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

module.exports = TestSpawn;
