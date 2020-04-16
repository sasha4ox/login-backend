import jwt from 'jsonwebtoken';
import Util from '../utils/Utils';

require('dotenv').config();

const util = new Util();
function Guard(request, response, next) {
  const token = request.token;
  if (!token) {
    request.userData = null;
    util.setError(401, 'You are not verified');
    return util.send(response);
  }
  jwt.verify(token, process.env.SECRET_KEY, function(error, decoded) {
    if (error) {
      util.setError(401, error);
      return util.send(response);
    }
    request.userData = decoded.user;
    next();
  });
}
export default Guard;
