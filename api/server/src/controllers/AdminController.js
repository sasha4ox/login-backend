import get from 'lodash/get';
import isEmpty from 'lodash/isEmpty';
import head from 'lodash/head';
import last from 'lodash/last';
import _split from 'lodash/split';
import AdminService from '../services/AdminService';
import Util from '../utils/Utils';

require('dotenv').config();

const util = new Util();
class AdminController {
  static async searchUsers(request, response) {
    const parameters = _split(get(request, 'params.params'), '&');
    const offset = _split(parameters[0], '=')[1];
    const limit = _split(parameters[1], '=')[1];
    const email = _split(parameters[2], '=')[1];
    const role = request.role;
    // console.log(role);
    let searchRole = [];
    if (role === 'superAdmin') {
      searchRole = [
        { role: 'user' },
        { role: 'admin' },
        { role: 'superAdmin' },
      ];
    } else if (role === 'admin') {
      searchRole = [{ role: 'user' }];
    }
    // console.log(searchRole);
    try {
      const allUsers = await AdminService.getUsers(
        offset,
        limit,
        email,
        searchRole,
      );
      const dataToClient = {
        users: head(allUsers),
        count: last(allUsers),
      };
      if (!isEmpty(head(allUsers))) {
        util.setSuccess(200, 'Users found.', dataToClient);
      } else {
        util.setError(404, 'No users found.');
      }
      return util.send(response);
    } catch (error) {
      util.setError(500, error.message);
      return util.send(response);
    }
  }

  static async updateUser(request, response) {
    /* NEED */
    const { id } = get(request, 'params');
    const dataToUpdate = request.body;
    try {
      const updateUser = await AdminService.updateUser(id, dataToUpdate);
      if (!updateUser) {
        util.setError(404, `Cannot find user.`);
      } else {
        util.setSuccess(200, 'User info updated.', updateUser);
      }
      return util.send(response);
    } catch (error) {
      util.setError(500, error);
      return util.send(response);
    }
  }
}

export default AdminController;
