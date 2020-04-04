import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import AuthService from '../services/AuthService';
import Util from '../utils/Utils';

require('dotenv').config();

const util = new Util();
// const secretKey = 'verySecretKey'
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

  static async someRoute(request, response) {
    const token = request.headers.authorization;

    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    console.log(decoded);
    util.setSuccess(200, 'dsdsds');
    return util.send(response);
  }

  static async someRoutePost(request, response) {
    // console.log(request.query);
    console.log(request.headers.authorization);
    util.setSuccess(200, 'dsdsds');
    return util.send(response);
  }

  static async login(request, response) {
    const { email, password } = request.body;
    if (!email) {
      util.setError(401, 'Invalid mail');
      return util.send(response);
    }

    console.log(email);
    try {
      const theUser = await AuthService.getAUser(email);
      if (!theUser) {
        util.setError(401, `Cannot find User with the email ${email}`);
        console.log('sdsa');
        return util.send(response);
      }

      const isPasswordValid = bcrypt.compareSync(password, theUser.password);

      if (!isPasswordValid) {
        util.setError(401, `Your password is incorrect, sorry`);
        return util.send(response);
      }
      jwt.sign(
        { user: theUser.dataValues },
        process.env.SECRET_KEY,
        { expiresIn: '1h' },
        (error, token) => {
          if (error) {
            util.setError(500, error);
            return util.send(response);
          }
          const data = {
            ...theUser.dataValues,
            token,
          };
          console.log('hi there222222222222', data);
          util.setSuccess(200, 'Yay, you are loged in', data);
          return util.send(response);
        },
      );
    } catch (error) {
      util.setError(404, 'what is it?');
      return util.send(response);
    }
  }

  static async registration(request, response) {
    if (!request.body.email || !request.body.password) {
      util.setError(
        401,
        'Bro, please check your email and password. They looks invalid',
      );
      return util.send(response);
    }
    let newUser = request.body;
    try {
      const isUserRegistered = await AuthService.getAUser(newUser.email);
      if (isUserRegistered) {
        util.setError(401, 'User with your email is registered');
        return util.send(response);
      }
      const hashPassword = bcrypt.hashSync(newUser.password, 10);
      newUser = {
        ...newUser,
        password: hashPassword,
      };
      const createdUser = await AuthService.addUser(newUser);
      jwt.sign(
        { user: createdUser.dataValues },
        process.env.SECRET_KEY,
        { expiresIn: '1h' },
        (error, token) => {
          if (error) {
            util.setError(500, error);
            return util.send(response);
          }
          const data = {
            ...createdUser.dataValues,
            token,
          };
          util.setSuccess(
            201,
            'Yay, you are created an account and you are loged in',
            data,
          );
          return util.send(response);
        },
      );
    } catch (error) {
      util.setError(400, error.message);
      return util.send(response);
    }
  }
}
export default AuthController;
