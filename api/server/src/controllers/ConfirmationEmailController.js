import jwt from 'jsonwebtoken';
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
        util.setError(401, error);
        return util.send(response);
      }
      const { email } = decoded.user;
      await ConfirmationEmailService.confirmUser(email);
      const theUser = await ConfirmationEmailService.getUser(email);
      if (!theUser.dataValues.confirmed) {
        util.setError(500, 'Something went wrong');
        return util.send(response);
      }
      util.setSuccess(200, 'Your email is confirmed');
      setTimeout(() => {
        return util.send(response);
      }, 3000);
    });
  }
}
export default ConfirmationEmailController;
