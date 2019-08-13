import { Context } from 'graphql-yoga/dist/types';
import { prisma, Group, GroupCreateInput, User } from '../model';
import log from '../util/log';
import auth from '../auth';
import group, { PermissionTypePayload } from '../auth/group';

const groupMutation = {
  async createGroup(_, args: { data: GroupCreateInput }, context: Context): Promise<Group> {
    const user: User = await auth.token.parse(context.request);

    try {
      const permission: PermissionTypePayload = await group.permission.$expand(user, 'group');

      if (!user) {
        // Write Log
        await log.warn({
          ip: context.request.ip,
          code: '#ERR_FF00'
        });
      }

      if (!permission.anyone.write) {
        // Write Log
        await log.warn({
          ip: context.request.ip,
          code: '#ERR_FF00',
          userId: user.id
        });
      }

      const groupExist: Group = await prisma.group({ name: args.data.name });

      if (groupExist) {
        // Write Log
        await log.warn({
          ip: context.request.ip,
          code: '#ERR_G000',
          customResult: groupExist.name,
          userId: user.id
        });
      }
      // Write Log
      await log.write({
        ip: context.request.ip,
        customResult: `Group ${args.data.name} create successed.`,
        userId: user.id
      });

      return prisma.createGroup(args.data);
    } catch (error) {
      // Write Log
      if (!/#ERR_/.test(error.message)) {
        await log.error({
          ip: context.request.ip,
          code: '#ERR_FFFF',
          customResult: error.message
        });
      }

      throw new Error(error.message);
    }
  }
};

export default groupMutation;
