
module.exports = (sequelize, DataTypes) => {
  const auth = sequelize.define(
    'auth',
    {
      email: DataTypes.STRING,
      password: DataTypes.STRING,
    },
    {},
  );
  auth.associate = function(models) {
    auth.hasMany(models.test);
    // associations can be defined here
  };
  return auth;
};
