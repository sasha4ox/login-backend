import jwt from 'jsonwebtoken';

import Util from '../utils/Utils';

require('dotenv').config();

const util = new Util();
class VerifyingController {
  static verifying(request, response) {
    const token = request.token;
    if (!token) {
      util.setError(401, 'you need a token');
      return util.send(response);
    }
    jwt.verify(token, process.env.SECRET_KEY, function(error, decoded) {
      if (error) {
        util.setError(401, error);
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
            ...decoded.user,
            newToken,
          };
          util.setSuccess(200, 'you are verified', data);
          return util.send(response);
        },
      );
    });
  }
}
export default VerifyingController;
