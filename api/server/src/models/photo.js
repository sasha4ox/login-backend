
module.exports = (sequelize, DataTypes) => {
  const photo = sequelize.define(
    'photo',
    {
      publickId: DataTypes.STRING,
      imageLink: DataTypes.STRING,
    },
    {},
  );
  photo.associate = function(models) {
    photo.belongsTo(models.auth);
  };
  return photo;
};
