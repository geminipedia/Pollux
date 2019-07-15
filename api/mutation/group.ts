import { Context } from 'graphql-yoga/dist/types';
import { Group, prisma } from '../model';
import log from '../util/log';

const groupMutation = {
  async createGroup(_, args, context: Context): Promise<Group> {
    try {
      const groupExist = await prisma.group({ name: args.name });

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
        result: `Group ${args.name} create successed.`
      });

      return context.prisma.createGroup(args);
    } catch (err) {
      throw new Error(err.message || '#ERR_FFFF');
    }
  }
};

export default groupMutation;
