import jwt from 'jsonwebtoken';
import Util from '../utils/Utils';
import VerifyingService from '../services/VerifyingService';

require('dotenv').config();

const util = new Util();
function Guard(request, response, next) {
  const token = request.token;
  if (!token) {
    request.userData = null;
    util.setError(401, 'You are not verified');
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
      util.setError(403, 'User is disactivated');
      return util.send(response);
    }

    request.userData = decoded.user;
    next();
  });
}
export default Guard;
