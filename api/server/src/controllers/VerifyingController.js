import jwt from 'jsonwebtoken';
import pickBy from 'lodash/pickBy';
import get from 'lodash/get';
import Util from '../utils/Utils';
import VerifyingService from '../services/VerifyingService';

require('dotenv').config();

const util = new Util();
class VerifyingController {
  static verifyingUser(request, response) {
    const token = request.token;
    if (!token) {
      util.setError(401, 'You need a token');
      return util.send(response);
    }
    jwt.verify(token, process.env.SECRET_KEY, async function(error, decoded) {
      try {
        if (error) {
          util.setError(401, error.message);
          return util.send(response);
        }
        const user = await VerifyingService.getUserById(decoded.user);
        if (!user) {
          util.setError(404, "Can't find user");
          return util.send(response);
        }
        if (!user.isActive) {
          util.setError(403, 'User is disactivated');
          return util.send(response);
        }
        const userData = pickBy(
          get(user, 'dataValues'),
          (value, key) => key !== 'password',
        );
        util.setSuccess(200, 'User is verified', userData);
        return util.send(response);
      } catch (error_) {
        util.setError(500, error_.message);
        return util.send(response);
      }
    });
  }

  static verifying(request, response) {
    const token = request.token;
    if (!token) {
      util.setError(401, 'you need a token');
      return util.send(response);
    }
    jwt.verify(token, process.env.SECRET_KEY, async function(error, decoded) {
      if (error) {
        util.setError(401, error);
        return util.send(response);
      }
      const user = await VerifyingService.getUserById(decoded.user);
      if (!user) {
        util.setError(404, "Can't find user");
        return util.send(response);
      }
      if (!user.isActive) {
        util.setError(403, 'User id disactivated');
        return util.send(response);
      }
      jwt.sign(
        { user: decoded.user },
        process.env.SECRET_KEY,
        { expiresIn: '1h' },
        (tokenError, newToken) => {
          if (tokenError) {
            util.setError(500, tokenError);
            return util.send(response);
          }
          const data = {
            id: decoded.user,
            newToken,
          };
          util.setSuccess(200, 'You are verified', data);
          return util.send(response);
        },
      );
    });
  }
}
export default VerifyingController;
