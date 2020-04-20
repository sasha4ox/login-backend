import _map from 'lodash/map';
import Sequelize from 'sequelize';
import database from '../models';

const Op = Sequelize.Op;
class UserService {
  static async getUsers(offset, limit, email) {
    const users = await database.auth.findAll({
      where: { email: { [Op.like]: `%${  email  }%` } },
      order: ['id'],
      offset,
      limit,
    });
    const count = await database.auth.count({
      where: { email: { [Op.like]: `%${  email  }%` } },
    });
    return [users, count];
  }

  static async getUserPhotos(id) {
    const photosBase = await database.photo.findAll({
      include: {
        model: database.auth,
        where: {
          id: Number(id),
        },
      },
    });

    const photos = _map(photosBase, item => {
      return {
        id: item.dataValues.id,
        publickId: item.dataValues.publickId,
        imageLink: item.dataValues.imageLink,
      };
    });

    return photos;
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
export default UserService;
