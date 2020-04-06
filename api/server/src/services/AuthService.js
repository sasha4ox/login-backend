import database from '../models';

class AuthService {
  static getUsers() {
    return database.auth.findAll();
  }

  static async getAUser(email) {
    const theUser = await database.auth.findOne({
      where: { email },
    });

    return theUser;
  }

  static addUser(newUser) {
    return database.auth.create(newUser);
  }
}

export default AuthService;
