import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { validationResult } from 'express-validator';
import get from 'lodash/get';
import pickBy from 'lodash/pickBy';
import isEmpty from 'lodash/isEmpty';
import nodeFetch from 'node-fetch';
import config from 'dotenv';
import AuthService from '../services/AuthService';
import Util from '../utils/Utils';
import sendingMail from '../utils/mail';

config.config();

require('dotenv').config();

const util = new Util();

class AuthController {
  static async getUsers(request, response) {
    try {
      const allAuth = await AuthService.getUsers();
      if (allAuth.length > 0) {
        util.setSuccess(200, 'Users received', allAuth);
      } else {
        util.setSuccess(200, 'No users found');
      }
      return util.send(response);
    } catch (error) {
      util.setError(500, error);
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
      const theUser = await AuthService.getAUserByEmail(email);
      if (!theUser) {
        util.setError(
          404,
          `Cannot find user with the Email :  ${email}. You should register.`,
        );
        return util.send(response);
      }
      const userData = pickBy(
        get(theUser, 'dataValues'),
        (value, key) => key !== 'password',
      );
      if (!userData.isActive) {
        util.setError(403, `Access denied. Contact to administrator.`);
        return util.send(response);
      }
      if (!userData.confirmed) {
        // If user not confirmed his email
        jwt.sign(
          { user: userData.id },
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
                `Email: ${email} is not verified, we sent to your email a letter. Please, check your mail for confirmation`,
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
      const userPhotos = await AuthService.getPhotos(userData.id);
      jwt.sign(
        { user: get(userData, 'id') },
        process.env.SECRET_KEY,
        { expiresIn: '1h' },
        (error, token) => {
          if (error) {
            util.setError(500, error);
            return util.send(response);
          }
          let data;

          if (isEmpty(userPhotos)) {
            data = {
              ...userData,
              token,
            };
          }
          data = {
            ...userData,
            token,
            photos: userPhotos,
          };
          util.setSuccess(200, 'Yay, you are loged in', data);
          return util.send(response);
        },
      );
    } catch (error) {
      util.setError(500, 'Something went wrong');
      return util.send(response);
    }
  }

  static async registration(request, response) {
    const errors = validationResult(request);
    if (!errors.isEmpty()) {
      util.setError(401, 'Please, check your fields. They looks invalid');
      return util.send(response);
    }
    let newUser = request.body;
    try {
      const isUserRegistered = await AuthService.getAUserByEmail(newUser.email);
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
      if (!createdUser) {
        util.setError(500, 'Server error');
        return util.send(response);
      }
      // FOR CHAT
      const dataToChat = {
        id: get(createdUser, 'dataValues.id'),
        email: get(createdUser, 'dataValues.email'),
        fullname: get(createdUser, 'dataValues.userName'),
        avatar: null,
      };
      nodeFetch(`${process.env.CHAT_SERVER}/user`, {
        method: 'POST',
        body: JSON.stringify(dataToChat),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      // FOR CHAT END

      jwt.sign(
        { user: get(createdUser, 'dataValues.id') },
        process.env.SECRET_KEY,
        { expiresIn: '1h' },
        (error, token) => {
          if (error) {
            util.setError(500, error.message);
            return util.send(response);
          }
          sendingMail(`${newUser.email}`, `${token}`, sendError => {
            if (sendError) {
              util.setError(500, sendError.message);
              return util.send(response);
            }
            util.setError(403, 'Please check your mail for confirmation');
            return util.send(response);
          });
        },
      );
    } catch (error) {
      util.setError(500, error.message);
      return util.send(response);
    }
  }
}
export default AuthController;
