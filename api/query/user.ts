import { Context } from 'graphql-yoga/dist/types';

import { prisma, User, UserWhereUniqueInput, UserWhereInput, UserOrderByInput } from '../model';
import group, { PermissionTypePayload } from '../auth/group';
import log from '../util/log';
import auth from '../auth';

const userQuery = {
  async user(_: any, args: { where: UserWhereUniqueInput }, context: Context): Promise<User> {
    try {
      return await prisma.user(args.where);
    } catch (error) {
      // Write Log
      if (!/#ERR_/.test(error.message)) {
        throw await log.error({
          ip: context.request.ip,
          code: '#ERR_FFFF',
          customResult: error.message
        });
      }

      throw new Error(error.message);
    }
  },

  async users(
    _: any,
    args: {
      where: UserWhereInput;
      orderBy: UserOrderByInput;
      skip?: number;
      after?: string;
      before?: string;
      first?: number;
      last?: number;
    },
    context: Context
  ): Promise<User[]> {
    try {
      const user: User = await auth.token.parse(context.request);

      if (!user) {
        // Write Log
        throw await log.warn({
          ip: context.request.ip,
          code: '#ERR_FF00'
        });
      }

      const permission: PermissionTypePayload = await group.permission.$expand(user, 'user');

      if (!permission.anyone.read) {
        // Write Log
        throw await log.warn({
          ip: context.request.ip,
          code: '#ERR_FF00'
        });
      }

      return await prisma.users({ ...args });
    } catch (error) {
      // Write Log
      if (!/#ERR_/.test(error.message)) {
        throw await log.error({
          ip: context.request.ip,
          code: '#ERR_FFFF',
          customResult: error.message
        });
      }

      throw new Error(error.message);
    }
  }
};

export default userQuery;
