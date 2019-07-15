import { Context } from 'graphql-yoga/dist/types';
import { prisma, Group, GroupCreateInput, User } from '../model';
import log from '../util/log';
import auth from '../auth';

const groupMutation = {
  async createGroup(_, args: { data: GroupCreateInput }, context: Context): Promise<Group> {
    const user: User = await auth.token.parse(context.request);

    try {
      const accessable: boolean = await prisma.user({ id: user.id }).group().permission().group().anyone().write();

      if (!accessable) {
        // Write Log
        log.warn({
          ip: context.request.ip,
          result: '#ERR_F000: Permission Deny.',
          userId: user.id
        });

        return;
      }

      const groupExist: Group = await prisma.group({ name: args.data.name });

      if (groupExist) {
        // Write Log
        await log.warn({
          ip: context.request.ip,
          result: `Group ${groupExist.name} already existed.`,
          userId: user.id
        });

        throw new Error('#ERR_G000');
      }
      // Write Log
      await log.write({
        ip: context.request.ip,
        result: `Group ${args.data.name} create successed.`,
        userId: user.id
      });

      return prisma.createGroup(args.data);
    } catch (err) {
      throw new Error(err.message || '#ERR_FFFF');
    }
  }
};

export default groupMutation;
