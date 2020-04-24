import _map from 'lodash/map';
import database from '../models';

class AuthService {
  static getUsers() {
    return database.auth.findAll();
  }

  static async getPhotos(id) {
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
        id: item.id,
        publickId: item.publickId,
        imageLink: item.imageLink,
      };
    });
    return photos;
  }

  static async getAUserByEmail(email) {
    const user = await database.auth.findOne({
      where: { email },
    });
    return user;
  }

  static addUser(newUser) {
    return database.auth.create(newUser);
  }
}

export default AuthService;
