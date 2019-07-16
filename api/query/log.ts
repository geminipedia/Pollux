import { Context } from 'graphql-yoga/dist/types';
import { prisma, Log, LogWhereUniqueInput, LogWhereInput, LogOrderByInput, User, Group } from '../model';
import log from '../util/log';
import auth from '../auth';
import group, { PermissionTypePayload } from '../auth/group';

const logQuery = {
  async log(_: any, args: { where: LogWhereUniqueInput }, context: Context): Promise<Log> {
    const user: User = await auth.token.parse(context.request);

    try {
      const permission: PermissionTypePayload = await group.permission.$expand(user, 'log');
      const targetLog: Log = await prisma.log(args.where);
      const targetLogOwner: User = await prisma.log(args.where).user();
      const targetLogOwnerGroup: Group = await prisma.log(args.where).user().group();
      const userGroup: Group = await prisma.user({ id: user.id }).group();

      if (!(permission.anyone.read || (permission.group.read && targetLogOwnerGroup.id === userGroup.id) || (permission.owner.read && targetLogOwner.id === user.id))) {
        // Write Log
        log.warn({
          ip: context.request.ip,
          result: '#ERR_F000: Permission Deny.',
          userId: user.id
        });

        return;
      }

      if (!targetLog) {
        // Write Log
        log.warn({
          ip: context.request.ip,
          result: '#ERR_L001: Log not found.',
          userId: user.id
        });

        return;
      }

      return targetLog;
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

  async logs(
    _: any,
    args: {
      where?: LogWhereInput;
      orderBy?: LogOrderByInput;
      skip?: number;
      after?: string;
      before?: string;
      first?: number;
      last?: number;
    },
    context: Context
  ): Promise<Log[]> {
    const user: User = await auth.token.parse(context.request);

    try {
      const permission: PermissionTypePayload = await group.permission.$expand(user, 'log');

      if (!permission.anyone.read) {
        // Write Log
        log.warn({
          ip: context.request.ip,
          result: '#ERR_F000: Permission Deny.',
          userId: user.id
        });

        return;
      }

      return await prisma.logs({ ...args });
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

export default logQuery;
