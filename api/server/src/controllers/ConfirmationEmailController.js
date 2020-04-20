import jwt from 'jsonwebtoken';
import get from 'lodash/get';
import Util from '../utils/Utils';
import ConfirmationEmailService from '../services/ConfirmationEmailService';

const util = new Util();
class ConfirmationEmailController {
  static confirmation(request, response) {
    const { token } = request;
    if (!token) {
      util.setError(401, 'You are not verified');
      return util.send(response);
    }
    jwt.verify(token, process.env.SECRET_KEY, async (error, decoded) => {
      if (error) {
        util.setError(401, error.message);
        return util.send(response);
      }
      const id = get(decoded, 'user');
      console.log(id);
      await ConfirmationEmailService.confirmUser(id);
      const theUser = await ConfirmationEmailService.getUser(id);
      if (!theUser.dataValues.confirmed) {
        util.setError(500, 'Something went wrong');
        return util.send(response);
      }
      util.setSuccess(200, 'Your email is confirmed');

      return util.send(response);
    });
  }
}
export default ConfirmationEmailController;
