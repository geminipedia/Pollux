import { Context } from 'graphql-yoga/dist/types';
import { prisma, Group, GroupCreateInput } from '../model';
import log from '../util/log';

const groupMutation = {
  async createGroup(_, args: { data: GroupCreateInput }, context: Context): Promise<Group> {
    try {
      const groupExist = await prisma.group({ name: args.data.name });

      if (groupExist) {
        // Write Log
        await log.warn({
          ip: context.request.ip,
          result: `Group ${groupExist.name} already existed.`
        });

        throw new Error('#ERR_G000');
      }
      // Write Log
      await log.write({
        ip: context.request.ip,
        result: `Group ${args.data.name} create successed.`
      });

      return prisma.createGroup(args.data);
    } catch (err) {
      throw new Error(err.message || '#ERR_FFFF');
    }
  }
};

export default groupMutation;
