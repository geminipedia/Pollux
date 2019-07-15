import { Context } from 'graphql-yoga/dist/types';
import { prisma, Group, GroupWhereInput, GroupOrderByInput, GroupWhereUniqueInput, User } from '../model';
import log from '../util/log';
import auth from '../auth';

const groupQuery = {
  async group(_: any, args: GroupWhereUniqueInput, context: Context): Promise<Group> {
    const user: User = await auth.token.parse(context.request);

    try {
      const accessable: boolean = await prisma.user({ id: user.id }).group().permission().group().group().read() || await prisma.user({ id: user.id }).group().permission().group().anyone().read();
      const userGroup: Group = await prisma.user({ id: user.id }).group();
      const targetGroup: Group = await prisma.group(args);

      if (!(accessable && userGroup.id === targetGroup.id)) {
        // Write Log
        log.warn({
          ip: context.request.ip,
          result: 'Permission Deny.',
          userId: user.id
        });

        throw new Error('#ERR_F000');
      }

      if (!targetGroup) {
        // Write Log
        log.warn({
          ip: context.request.ip,
          result: 'Group not found.',
          userId: user.id
        });

        throw new Error('#ERR_I001');
      }

      return targetGroup;
    } catch (error) {
      // Write Log
      log.error({
        ip: context.request.ip,
        result: `Unexpected Error. ${error.message}`,
        userId: user.id
      });

      throw new Error(error.message || '#ERR_FFFF');
    }
  },

  async groups({_, args, context}:
    {
      _: any;
      args?: {
        where?: GroupWhereInput;
        orderBy?: GroupOrderByInput;
        skip?: number;
        after?: string;
        before?: string;
        first?: number;
        last?: number;
      };
      context: Context;
    }
  ): Promise<Group[]> {
    const user: User = await auth.token.parse(context.request);

    try {
      const accessable: boolean = await prisma.user({ id: user.id }).group().permission().group().anyone().read();

      if (!accessable) {
        // Write Log
        log.warn({
          ip: context.request.ip,
          result: 'Permission Deny.',
          userId: user.id
        });

        throw new Error('#ERR_F000');
      }

      return await prisma.groups(args);
    } catch (error) {
      // Write Log
      log.error({
        ip: context.request.ip,
        result: `Unexpected Error. ${error.message}`,
        userId: user.id
      });

      throw new Error(error.message || '#ERR_FFFF');
    }
  }
};

export default groupQuery;
