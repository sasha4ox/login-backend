import AuthService from '../services/AuthService';
import Util from '../utils/Utils';

const util = new Util();

class AuthController {
  static async getAllAuths(request, response) {
    try {
      const allAuth = await AuthService.getAllAuths();
      console.log(allAuth);
      if (allAuth.length > 0) {
        util.setSuccess(200, 'Auth retrieved', allAuth);
      } else {
        util.setSuccess(200, 'No auth found');
      }
      return util.send(response);
    } catch (error) {
      util.setError(400, error);
      return util.send(response);
    }
  }
}
export default AuthController;
