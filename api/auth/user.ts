import { Profile } from 'passport-google-oauth20';
import { Request } from 'express';

import { prisma, User } from '../model';
import log from '../util/log';
import token from './token';
import auth from '.';

const user = {
  async signUp(req: Request, profile: Profile): Promise<void> {
    try {
      // Is user existed
      const userExisted = await prisma.user({ userName: profile.id });
      if (userExisted) {
        await user.signIn(req, userExisted.id);

        return;
      }

      // Create User
      const newUser: User = await prisma.createUser({
        userName: profile.id,
        email: profile.emails[0].value,
        firstName: profile.name.givenName,
        lastName: profile.name.familyName,
        displayName: profile.displayName,
        group: {
          connect: {
            name: process.env.DEFAULT_GROUP
          }
        }
      });

      // Upload User Avatar
      await prisma.updateUser({
        data: {
          avatar: {
            create: {
              name: `${newUser.id}_avatar`,
              file: {
                create: {
                  name: `${newUser.id}_avatar.${profile.photos[0].value.split('.').slice(-1)[0]}`,
                  path: profile.photos[0].value,
                  uploadBy: {
                    connect: {
                      id: newUser.id
                    }
                  }
                }
              }
            }
          }
        },
        where: {
          id: newUser.id
        }
      });

      // Write Log
      await log.write({
        ip: req.ip,
        result: 'Create user account successed.',
        userId: newUser.id
      });
    } catch (error) {
      // Write Log
      await log.error({
        ip: req.ip,
        result: `Cannot create user account.\n\nError: ${error}`
      });

      throw new Error('ERR_FFFF');
    }
  },

  async signIn(req: Request, userId?: User['id'], userEmail?: User['email']) {
    try {
      if (!userId) {
        const targetUser = await prisma.user({ email: userEmail });
        userId = targetUser.id;
      } else if (!userEmail) {
        const targetUser = await prisma.user({ id: userId });
        userEmail = targetUser.email;
      }

      // Gen token and send it
      const key = await auth.sign({
        id: userId,
        email: userEmail
      });
      token.set(req.res, key);

      // Write Log
      await log.write({
        ip: req.ip,
        result: `Account ${userEmail} authorization successd.`,
        userId
      });

    } catch (error) {
      // Write Log
      await log.error({
        ip: req.ip,
        result: `Account ${userEmail} authorization failed.\n\nError: ${error}`,
        userId
      });

      throw new Error('ERR_U00F');
    }
  }
};

export default user;
