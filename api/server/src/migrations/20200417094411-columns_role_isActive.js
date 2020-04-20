

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn('auths', 'role', {
        type: Sequelize.STRING,
        defaultValue: 'user',
      }),
      queryInterface.addColumn('auths', 'isActive', {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      }),
    ]);
  },

  down: queryInterface => {
    return Promise.all([
      queryInterface.removeColumn('auths', 'role'),
      queryInterface.removeColumn('auths', 'isActive'),
    ]);
  },
};
