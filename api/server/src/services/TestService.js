import database from '../models';

class TestService {
  static getAllTests() {
    return database.Test.findAll();
  }

  static addTest(newTest) {
    return database.Test.create(newTest);
  }

  static async updateTest(id, updateTest) {
    const testToUpdate = await database.Test.findOne({
      where: { id: Number(id) },
    });

    if (testToUpdate) {
      await database.Test.update(updateTest, { where: { id: Number(id) } });

      return updateTest;
    }
    return null;
  }

  static async getATest(id) {
    const theTest = await database.Test.findOne({
      where: { id: Number(id) },
    });

    return theTest;
  }

  static async deleteTest(id) {
    const testToDelete = await database.Test.findOne({
      where: { id: Number(id) },
    });

    if (testToDelete) {
      const deletedTest = await database.Test.destroy({
        where: { id: Number(id) },
      });
      return deletedTest;
    }
    return null;
  }
}

export default TestService;
