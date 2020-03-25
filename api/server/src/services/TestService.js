import database from '../models';

class TestService {
    static async getAllTests() {
        try {
            return await database.Test.findAll({
            });
        } catch (error) {
            throw error;
        }
    }

    static async addTest(newTest) {
        try {
            return await database.Test.create(newTest);
        } catch (error) {
            throw error;
        }
    }

    static async updateTest(id, updateTest) {
        try {
            const testToUpdate = await database.Test.findOne({
                where: { id: Number(id) }
            });

            if (testToUpdate) {
                await database.Test.update(updateTest, { where: { id: Number(id) } });

                return updateTest;
            }
            return null;
        } catch (error) {
            throw error;
        }
    }

    static async getATest(id) {
        try {
            const theTest = await database.Test.findOne({
                where: { id: Number(id) }
            },
            );

            return theTest;
        } catch (error) {
            throw error;
        }
    }

    static async deleteTest(id) {
        try {
            const testToDelete = await database.Test.findOne({ where: { id: Number(id) } });

            if (testToDelete) {
                const deletedTest = await database.Test.destroy({
                    where: { id: Number(id) }
                });
                return deletedTest;
            }
            return null;
        } catch (error) {
            throw error;
        }
    }
}

export default TestService;