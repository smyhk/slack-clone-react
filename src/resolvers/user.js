import bcrypt from 'bcryptjs';
import _ from 'lodash';

import { tryLogin } from '../../auth';

const formatErrors = (e, models) => {
  if (e instanceof models.sequelize.ValidationError) {
    return e.errors.map(x => _.pick(x, ['path', 'message']));
  }
  return [{ path: 'name', message: 'something went wrong' }];
};

export default {
  Query: {
    getUser: (parent, { id }, { models }) =>
      models.User.findOne({ where: { id } }),
    allUsers: (parent, args, { models }) => models.User.findAll()
  },
  Mutation: {
    login: (parent, { email, password }, { models, SECRET, SECRET2 }) =>
      tryLogin(email, password, models, SECRET, SECRET2),
    registerUser: async (parent, { password, ...otherArgs }, { models }) => {
      try {
        if (password.length < 6 || password.length > 41) {
          return {
            ok: false,
            errors: [
              {
                path: 'password',
                message: 'Password needs to be 6-40 characters'
              }
            ]
          };
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await models.User.create({
          ...otherArgs,
          password: hashedPassword
        });
        return {
          ok: true,
          user
        };
      } catch (err) {
        return {
          ok: false,
          errors: formatErrors(err, models)
        };
      }
    }
  }
};
