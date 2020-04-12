module.exports = (sequelize, DataTypes) => {
  const auth = sequelize.define(
    'auth',
    {
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      confirmed: DataTypes.BOOLEAN,
      userName: DataTypes.STRING,
    },
    {},
  );
  auth.associate = function(models) {
    auth.hasMany(models.photo);
    // associations can be defined here
  };
  return auth;
};
