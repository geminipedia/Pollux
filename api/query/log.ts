import { Context } from 'graphql-yoga/dist/types';

import { prisma, Log, LogWhereUniqueInput, LogWhereInput, LogOrderByInput, User } from '../model';
import group, { PermissionTypePayload, RelationPayload } from '../auth/group';
import log from '../util/log';
import auth from '../auth';

const logQuery = {
  async log(_: any, args: { where: LogWhereUniqueInput }, context: Context): Promise<Log> {
    const user: User = await auth.token.parse(context.request);

    try {
      const targetLog: Log = await prisma.log(args.where);
      const permission: PermissionTypePayload = await group.permission.$expand(user, 'log');
      const relation: RelationPayload = await group.relation.$check(user, targetLog.id, 'log');

      if (!(permission.anyone.read || (permission.group.read && relation.isMember) || (permission.owner.read && relation.isOwner))) {
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
