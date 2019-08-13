import { Context } from 'graphql-yoga/dist/types';

import { prisma, Admin, AdminCreateInput, User } from '../model';
import log from '../util/log';
import auth from '../auth';
import group, { PermissionTypePayload } from '../auth/group';

const adminMutation = {
  async createAdmin(_: any, args: { data: AdminCreateInput }, context: Context): Promise<Admin> {
    try {
      const user: User = await auth.token.parse(context.request);

      if (!user) {
        // Write Log
        throw await log.warn({
          ip: context.request.ip,
          code: '#ERR_FF00'
        });
      }

      const permission: PermissionTypePayload = await group.permission.$expand(user, 'admin');

      if (!permission.owner.write) {
        // Write Log
        throw await log.warn({
          ip: context.request.ip,
          code: '#ERR_FF00'
        });
      }

      const adminExist: Admin = await prisma.admin({ name: args.data.name });

      if (adminExist) {
        // Write Log
        throw await log.warn({
          ip: context.request.ip,
          code: '#ERR_A000',
          customResult: adminExist.name,
          userId: user.id
        });
      }

      // Write Log
      await log.write({
        ip: context.request.ip,
        customResult: `Admin ${args.data.name} create successed.`,
        userId: user.id
      });

      return await prisma.createAdmin(args.data);
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

export default adminMutation;
