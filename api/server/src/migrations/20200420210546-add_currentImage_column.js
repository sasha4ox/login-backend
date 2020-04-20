

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn('auths', 'currentImage', {
        type: Sequelize.STRING,
      }),
    ]);
  },

  down: queryInterface => {
    return Promise.all([queryInterface.removeColumn('auths', 'currentImage')]);
  },
};
