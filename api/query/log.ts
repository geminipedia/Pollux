import { Context } from 'graphql-yoga/dist/types';

import { prisma, Log, LogWhereUniqueInput, LogWhereInput, LogOrderByInput, User } from '../model';
import group, { PermissionTypePayload, RelationPayload } from '../auth/group';
import log from '../util/log';
import auth from '../auth';

const logQuery = {
  async log(_: any, args: { where: LogWhereUniqueInput }, context: Context): Promise<Log> {
    try {
      const user: User = await auth.token.parse(context.request);

      if (!user) {
        // Write Log
        throw await log.warn({
          ip: context.request.ip,
          code: '#ERR_FF00'
        });
      }

      const targetLog: Log = await prisma.log(args.where);
      const permission: PermissionTypePayload = await group.permission.$expand(user, 'log');
      const relation: RelationPayload = await group.relation.$check(user, targetLog.id, 'log');

      if (!(permission.anyone.read || (permission.group.read && relation.isMember) || (permission.owner.read && relation.isOwner))) {
        // Write Log
        throw await log.warn({
          ip: context.request.ip,
          code: '#ERR_FF00',
          userId: user.id
        });
      }

      if (!targetLog) {
        // Write Log
        throw await log.warn({
          ip: context.request.ip,
          code: '#ERR_L001',
          userId: user.id
        });
      }

      return targetLog;
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
      if (!user) {
        // Write Log
        throw await log.warn({
          ip: context.request.ip,
          code: '#ERR_FF00'
        });
      }

      const permission: PermissionTypePayload = await group.permission.$expand(user, 'log');

      const queriedLogs: Log[] = await prisma.logs({ ...args });
      const result: Log[] = [];

      if (permission.anyone.read) {
        return queriedLogs;
      }

      queriedLogs.forEach(async logData => {
        // Filter out content that you don't have permission to browse.
        const relation: RelationPayload = await group.relation.$check(user, logData.id, 'log');
        if ((permission.group.read && relation.isMember) || (permission.owner.read && relation.isOwner)) {
          result.push(logData);
        }
        return;
      });

      return result;
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

export default logQuery;
