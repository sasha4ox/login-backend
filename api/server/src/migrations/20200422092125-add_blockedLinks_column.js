

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn('auths', 'blockedLinks', {
        type: Sequelize.STRING,
        defaultValue: '',
      }),
    ]);
  },

  down: queryInterface => {
    return Promise.all([queryInterface.removeColumn('auths', 'blockedLinks')]);
  },
};
