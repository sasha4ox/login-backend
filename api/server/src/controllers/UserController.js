import jwt from 'jsonwebtoken';

import Util from '../utils/Utils';
import UserService from '../services/UserService';

require('dotenv').config();

const util = new Util();
class UserController {
  static async getUserProfile(request, response) {
    const token = request.token;
    if (!token) {
      util.setError(401, 'You are need a token');
      return util.send(response);
    }

    jwt.verify(token, process.env.SECRET_KEY, async function(error, decoded) {
      if (error) {
        util.setError(401, error);
        return util.send(response);
      }
      const { email } = decoded.user;

      const user = await UserService.getUser(email);
      const userPhotos = await UserService.getUserPhotos(email);
      let data;
      if (userPhotos.length === 0) {
        data = {
          ...user.dataValues,
          token,
        };
      }
      data = {
        ...user.dataValues,
        token,
        photos: userPhotos,
      };
      util.setSuccess(200, 'Yay, you are loged in', data);
      return util.send(response);
    });
  }

  static async updateUser(request, response) {
    const { id } = request.params;
    const dataToUpdate = request.body;

    try {
      const updateUser = await UserService.updateUser(id, dataToUpdate);
      if (!updateUser) {
        util.setError(404, `Cannot find user with the id: ${id}`);
      } else {
        util.setSuccess(200, 'User updated', updateUser);
      }
      return util.send(response);
    } catch (error) {
      util.setError(404, error);
      return util.send(response);
    }
  }
}

export default UserController;
