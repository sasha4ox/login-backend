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
    },
    {},
  );
  Test.associate = noop; // models => {}
  // associations can be defined here
  return Test;
};
