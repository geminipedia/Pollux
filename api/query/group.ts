import { Context } from 'graphql-yoga/dist/types';
import { prisma, Group, GroupWhereInput, GroupOrderByInput, GroupWhereUniqueInput, User } from '../model';
import log from '../util/log';
import auth from '../auth';

const groupQuery = {
  async group(_: any, args: { where: GroupWhereUniqueInput }, context: Context): Promise<Group> {
    const user: User = await auth.token.parse(context.request);

    try {
      const accessable: boolean = await prisma.user({ id: user.id }).group().permission().group().group().read() || await prisma.user({ id: user.id }).group().permission().group().anyone().read();
      const userGroup: Group = await prisma.user({ id: user.id }).group();
      const targetGroup: Group = await prisma.group(args.where);

      if (!(accessable && userGroup.id === targetGroup.id)) {
        // Write Log
        log.warn({
          ip: context.request.ip,
          result: '#ERR_F000: Permission Deny.',
          userId: user.id
        });

        return;
      }

      if (!targetGroup) {
        // Write Log
        log.warn({
          ip: context.request.ip,
          result: '#ERR_G001: Group not found.',
          userId: user.id
        });

        return;
      }

      return targetGroup;
    } catch (error) {
      // Write Log
      log.error({
        ip: context.request.ip,
        result: `#ERR_FFFF: Unexpected Error. ${error.message}`,
        userId: user.id
      });

      throw new Error(error.message || '#ERR_FFFF');
    }
  },

  async groups(
      _: any,
      args: {
        where?: GroupWhereInput;
        orderBy?: GroupOrderByInput;
        skip?: number;
        after?: string;
        before?: string;
        first?: number;
        last?: number;
      },
      context: Context
  ): Promise<Group[]> {
    const user: User = await auth.token.parse(context.request);

    try {
      const accessable: boolean = await prisma.user({ id: user.id }).group().permission().group().anyone().read();

      if (!accessable) {
        // Write Log
        log.warn({
          ip: context.request.ip,
          result: '#ERR_F000: Permission Deny.',
          userId: user.id
        });

        return;
      }

      return await prisma.groups({ ...args });
    } catch (error) {
      // Write Log
      log.error({
        ip: context.request.ip,
        result: `#ERR_FFFF: Unexpected Error. ${error.message}`,
        userId: user.id
      });

      throw new Error(error.message || '#ERR_FFFF');
    }
  }
};

export default groupQuery;
