import _map from 'lodash/map';
import database from '../models';

class AuthService {
  static getUsers() {
    return database.auth.findAll();
  }

  static async getPhotos(email) {
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

  static async getAUser(email) {
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
