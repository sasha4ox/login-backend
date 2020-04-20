import database from '../models';

class VerifyingService {
  static async getUserById(id) {
    const user = await database.auth.findOne({
      where: { id: Number(id) },
    });
    return user;
  }
}
export default VerifyingService;
