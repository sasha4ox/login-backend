import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import Util from '../utils/Utils';
import UserService from '../services/UserService';

require('dotenv').config();

const util = new Util();
class UserController {
  static async getUserProfile(request, response) {
    const token = request.token;

    try {
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

        const user = await UserService.getUserByEmail(email);
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
        util.setSuccess(200, 'User updated', updateUser);
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
        util.setError(404, `Cannot find user with the id: ${id}`);
        return util.send(response);
      }
      const user = userData.dataValues;
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
        util.setError(403, `New password incorrect`);
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
      util.setSuccess(200, 'User updated', updateUser);
      return util.send(response);
    } catch (error) {
      util.setError(500, error);
      return util.send(response);
    }
  }
}

export default UserController;
