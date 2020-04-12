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
    // const user = await database.auth.findOne({
    //   where: { email },
    // });
    // database.auth
    //   .findOne({ where: { email } })
    //   .then(auth => auth.getPhotos())
    //   .then(result => console.log(result));
    // const user = await database.auth.findOne({ where: { email } });
    // const photos = await user.getPhotos();
    // if (!photos) {
    //   console.log(user);
    //   return user;
    // }
    // console.log(user);
    // include: {
    //   model: database.photo,
    //   include: {
    //     model: database.auth,
    //     where: { email },
    //   },
    // },

    // return user;
    // console.log('PHOTO', user.photos);
    // console.log('USER', user);
    // const photosBase = await database.photo.findAll({
    //   include: {
    //     model: database.auth,
    //     where: {
    //       email: 'sas@sas.sas',
    //     },
    //   },
    // });
    // console.log('PHOTO', photos);
    // const photos = photosBase.map(item => {
    //   return {
    //     id: item.dataValues.id,
    //     publickId: item.dataValues.publickId,
    //     imageLink: item.dataValues.imageLink,
    //   };
    // });
    // const userData = {
    //   user: photosBase[0].auth.dataValues,
    //   photos,
    // };
    // console.log(userData);
  }

  static addUser(newUser) {
    return database.auth.create(newUser);
  }
}

export default AuthService;
