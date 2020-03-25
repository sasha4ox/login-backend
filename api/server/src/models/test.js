import noop from 'lodash/noop';

module.exports = (sequelize, DataTypes) => {
  const Test = sequelize.define(
    'Test',
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      age: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    }, {});
  Test.associate = function (models) {
    Test.hasMany(models.Task);
    // associations can be defined here
  };
  return Test;
};
