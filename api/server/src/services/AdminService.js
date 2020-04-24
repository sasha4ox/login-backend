import Sequelize from 'sequelize';
import database from '../models';

const Op = Sequelize.Op;
class AdminService {
  static async getUsers(offset, limit, email, role) {
    const users = await database.auth.findAll({
      where: { email: { [Op.like]: `%${email}%` }, [Op.or]: role },
      order: ['id'],
      offset,
      limit,
    });
    const count = await database.auth.count({
      where: { email: { [Op.like]: `%${email}%` } },
    });
    return [users, count];
  }

  static async getUserById(id) {
    const user = await database.auth.findOne({
      where: { id: Number(id) },
    });
    return user;
  }

  static async updateUser(id, updateUser) {
    const userToUpdate = await database.auth.findOne({
      where: { id: Number(id) },
    });

    if (userToUpdate) {
      await database.auth.update(updateUser, { where: { id: Number(id) } });

      return updateUser;
    }
    return null;
  }
}
export default AdminService;
