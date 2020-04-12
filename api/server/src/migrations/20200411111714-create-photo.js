
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('photos', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      publickId: {
        type: Sequelize.STRING,
      },
      imageLink: {
        type: Sequelize.STRING,
      },
      authId: {
        type: Sequelize.INTEGER,
        references: {
          key: 'id',
          model: 'auths',
        },
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  down: queryInterface => {
    return queryInterface.dropTable('photos');
  },
};
