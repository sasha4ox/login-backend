import Util from '../utils/Utils';
import AdminService from '../services/AdminService';

require('dotenv').config();

const util = new Util();
async function AdminGuard(request, response, next) {
  const id = request.userData;
  const user = await AdminService.getUserById(id);
  if (!user) {
    util.setError(404, 'User not found');
    return util.send(response);
  }
  if (user.role === 'admin' || user.role === 'superAdmin') {
    request.role = user.role;
    return next();
  }
  util.setError(403, 'You do not have permission');
  util.send(response);
}
export default AdminGuard;
