module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn('auths', 'confirmed', {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      }),
      queryInterface.addColumn('auths', 'userName', {
        type: Sequelize.STRING,
      }),
    ]);
  },

  down: queryInterface => {
    return Promise.all([
      queryInterface.removeColumn('auths', 'confirmed'),
      queryInterface.removeColumn('auths', 'userName'),
    ]);
  },
};
