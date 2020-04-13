import _map from 'lodash/map';
import database from '../models';

class UserService {
  static async getUserPhotos(email) {
    const photosBase = await database.photo.findAll({
      include: {
        model: database.auth,
        where: {
          email,
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
    console.log('SERVICE PHOTO:', photos);
    return photos;
  }

  static async getUserByEmail(email) {
    const user = await database.auth.findOne({
      where: { email },
    });
    return user;
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
