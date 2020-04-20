import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import pickBy from 'lodash/pickBy';
import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import head from 'lodash/head';
import last from 'lodash/last';
import _split from 'lodash/split';
import UserService from '../services/UserService';
import Util from '../utils/Utils';

require('dotenv').config();

const util = new Util();
class UserController {
  static async getAllusers(request, response) {
    // const params = request.params.params.split('&');
    const parameters = _split(get(request, 'params.params'), '&');
    const offset = _split(parameters[0], '=')[1];
    const limit = _split(parameters[1], '=')[1];
    const email = _split(parameters[2], '=')[1];
    try {
      const allUsers = await UserService.getUsers(offset, limit, email);
      const dataToClient = {
        users: head(allUsers),
        count: last(allUsers),
      };
      if (!isEmpty(head(allUsers))) {
        util.setSuccess(200, 'Users received', dataToClient);
      } else {
        util.setError(404, 'No users found');
      }
      return util.send(response);
    } catch (error) {
      util.setError(500, error.message);
      return util.send(response);
    }
  }

  static async getUserProfile(request, response) {
    const id = get(request, 'params.id');

    const token = request.token;
    try {
      if (!token) {
        util.setError(401, 'You are need a token');
        return util.send(response);
      }

      jwt.verify(token, process.env.SECRET_KEY, async function(error, decoded) {
        if (error) {
          console.info(decoded);
          util.setError(401, error.message);
          return util.send(response);
        }

        const user = await UserService.getUserById(id);
        const userPhotos = await UserService.getUserPhotos(id);
        const userData = pickBy(
          get(user, 'dataValues'),
          (value, key) => key !== 'password',
        );
        let data;
        if (isEmpty(userPhotos)) {
          data = {
            ...userData,
            token,
          };
        }
        data = {
          ...userData,
          token,
          photos: userPhotos,
        };
        util.setSuccess(200, 'Yay, you are loged in', data);
        return util.send(response);
      });
    } catch (error) {
      util.setError(500, error);
      return util.send(response);
    }
  }

  static async updateUser(request, response) {
    const { id } = request.params;
    const dataToUpdate = request.body;

    try {
      const updateUser = await UserService.updateUser(id, dataToUpdate);
      if (!updateUser) {
        util.setError(404, `Cannot find user with the id: ${id}`);
      } else {
        util.setSuccess(200, 'Your info updated', updateUser);
      }
      return util.send(response);
    } catch (error) {
      util.setError(500, error);
      return util.send(response);
    }
  }

  static async changePassword(request, response) {
    const { id } = request.params;
    const { currentPassword, newPassword, newPassword2 } = request.body;
    try {
      const userData = await UserService.getUserById(id);
      if (!userData) {
        util.setError(404, `Cannot find User`);
        return util.send(response);
      }
      const user = get(userData, 'dataValues');

      const isPasswordValid = bcrypt.compareSync(
        currentPassword,
        user.password,
      );
      if (!isPasswordValid) {
        util.setError(
          403,
          `Your password is incorrect, please enter current password correctly`,
        );
        return util.send(response);
      }
      if (newPassword !== newPassword2) {
        util.setError(401, `New password is incorrect`);
        return util.send(response);
      }
      const hashPassword = bcrypt.hashSync(newPassword, 10);
      const dataToUpdate = {
        ...user,
        password: hashPassword,
      };
      const updateUser = await UserService.updateUser(id, dataToUpdate);
      if (!updateUser) {
        util.setError(404, `Cannot find user with the id: ${id}`);
        return util.send(response);
      }
      const userDataToClient = pickBy(
        updateUser,
        (value, key) => key !== 'password',
      );
      console.log(userDataToClient);
      util.setSuccess(200, 'Password updated', userDataToClient);
      return util.send(response);
    } catch (error) {
      util.setError(500, error);
      return util.send(response);
    }
  }
}

export default UserController;
