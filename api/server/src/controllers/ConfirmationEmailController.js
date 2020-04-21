import get from 'lodash/get';
import Util from '../utils/Utils';
import ConfirmationEmailService from '../services/ConfirmationEmailService';

const util = new Util();
class ConfirmationEmailController {
  static async confirmation(request, response) {
    const id = get(request, 'userData');
    await ConfirmationEmailService.confirmUser(id);
    const theUser = await ConfirmationEmailService.getUser(id);
    if (!theUser.dataValues.confirmed) {
      util.setError(500, 'Something went wrong');
      return util.send(response);
    }
    const dataToClient = {
      token: get(request, 'token'),
    };
    util.setSuccess(200, 'Your email is confirmed', dataToClient);

    return util.send(response);
    // });
  }
}
export default ConfirmationEmailController;
