'use strict';
module.exports = (sequelize, DataTypes) => {
  const Task = sequelize.define('Task', {
    name: DataTypes.STRING,
    Description: DataTypes.STRING
  }, {});
  Task.associate = function(models) {
    Task.belongsTo(models.Test);
    // associations can be defined here
  };
  return Task;
};
