import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { validationResult } from 'express-validator';
import AuthService from '../services/AuthService';
import Util from '../utils/Utils';
import sendingMail from '../utils/mail';

require('dotenv').config();

const util = new Util();
// const secretKey = 'verySecretKey'
class AuthController {
  static async getUsers(request, response) {
    try {
      const allAuth = await AuthService.getUsers();
      // console.log(allAuth);
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

  static async login(request, response) {
    const errors = validationResult(request);
    const { email, password } = request.body;
    if (!errors.isEmpty()) {
      util.setError(
        401,
        'Please, check your email and password. They looks invalid',
      );
      return util.send(response);
    }

    try {
      const theUser = await AuthService.getAUser(email);
      if (!theUser) {
        util.setError(
          401,
          `Cannot find user with the Email :  ${email}. You should register.`,
        );
        return util.send(response);
      }
      if (!theUser.dataValues.confirmed && theUser) {
        jwt.sign(
          { user: theUser.dataValues },
          process.env.SECRET_KEY,
          { expiresIn: '1h' },
          (error, token) => {
            if (error) {
              util.setError(500, error);
              return util.send(response);
            }
            sendingMail(`${email}`, `${token}`, sendError => {
              if (sendError) {
                util.setError(500, sendError);
                return util.send(response);
              }
              util.setError(
                403,
                `Email: ${email} is not verified, we sand a letter to your email. Please check your mail for confirmation`,
              );
              return util.send(response);
            });
          },
        );
        return;
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
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      util.setError(
        401,
        'Please,check your email and password. They looks invalid',
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
      console.log(createdUser.dataValues);

      jwt.sign(
        { user: createdUser.dataValues },
        process.env.SECRET_KEY,
        { expiresIn: '1h' },
        (error, token) => {
          if (error) {
            util.setError(500, error);
            return util.send(response);
          }

          sendingMail(`${newUser.email}`, `${token}`, sendError => {
            if (sendError) {
              util.setError(500, sendError);
              console.log('WHATWHAT,', token);
              return util.send(response);
            }
            console.log('WHAT,', token);
            util.setError(403, 'Please check your mail for confirmation');
            return util.send(response);
          });
        },
      );
    } catch (error) {
      util.setError(400, error.message);
      return util.send(response);
    }
  }
}
export default AuthController;
