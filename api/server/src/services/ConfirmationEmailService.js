import database from '../models';

class ConfirmationEmailService {
  static async confirmUser(id) {
    const theUser = await database.auth.update(
      { confirmed: true },
      {
        where: { id: Number(id) },
      },
    );
    return theUser;
  }

  static async getUser(id) {
    const user = await database.auth.findOne({
      where: { id: Number(id) },
    });
    return user;
  }
}

export default ConfirmationEmailService;
