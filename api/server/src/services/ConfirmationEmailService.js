import database from '../models';

class ConfirmationEmailService {
  static async confirmUser(email) {
    const theUser = await database.auth.update(
      { confirmed: true },
      {
        where: { email },
      },
    );
    return theUser;
  }

  static async getUser(email) {
    const user = await database.auth.findOne({
      where: { email },
    });
    return user;
  }
}

export default ConfirmationEmailService;
