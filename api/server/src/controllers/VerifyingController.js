import jwt from 'jsonwebtoken';
import Util from '../utils/Utils';

require('dotenv').config();

const util = new Util();
class VerifyingController {
  static verifying(request, response) {
    const token = request.headers.authorization;

    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    console.log(decoded);
    util.setSuccess(200, decoded);
    return util.send(response);
  }
}
export default VerifyingController;
