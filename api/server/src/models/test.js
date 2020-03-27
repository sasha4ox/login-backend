
module.exports = (sequelize, DataTypes) => {
  const test = sequelize.define(
    'test',
    {
      book: DataTypes.STRING,
    },
    {},
  );
  test.associate = function(models) {
    test.belongsTo(models.auth);
    // associations can be defined here
  };
  return test;
};
