module.exports = {
  up: queryInterface => {
    return queryInterface.createTable('tests', {});
  },
  down: queryInterface => {
    return queryInterface.dropTable('tests');
  },
};
