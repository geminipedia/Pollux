import { Context } from 'graphql-yoga/dist/types';

import { Admin, AdminWhereUniqueInput, prisma, AdminWhereInput, AdminOrderByInput, User } from '../model';
import group, { PermissionTypePayload, RelationPayload } from '../auth/group';
import log from '../util/log';
import auth from '../auth';

const adminQuery = {
  async admin(_: any, args: { where: AdminWhereUniqueInput }, context: Context): Promise<Admin> {
    try {
      const user: User = await auth.token.parse(context.request);

      if (!user) {
        // Write Log
        throw await log.warn({
          ip: context.request.ip,
          code: '#ERR_FF00',
          userId: user.id
        });
      }

      const targetAdmin: Admin = await prisma.admin(args.where);

      if (!targetAdmin) {
        // Write Log
        throw await log.warn({
          ip: context.request.ip,
          code: '#ERR_A001',
          userId: user.id
        });
      }

      const permission: PermissionTypePayload = await group.permission.$expand(user, 'admin');
      const relation: RelationPayload = await group.relation.$check(user, targetAdmin.id, 'admin');

      if (!(permission.anyone.read || (permission.group.read && relation.isMember) || (permission.owner.read && relation.isOwner))) {
        // Write Log
        throw await log.warn({
          ip: context.request.ip,
          code: '#ERR_FF00',
          userId: user.id
        });
      }

      return targetAdmin;
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

  async admins(
    _: any,
    args: {
      where?: AdminWhereInput;
      orderBy?: AdminOrderByInput;
      skip?: number;
      after?: string;
      before?: string;
      first?: number;
      last?: number;
    },
    context: Context
  ): Promise<Admin[]> {
    try {
      const user: User = await auth.token.parse(context.request);

      if (!user) {
        // Write Log
        log.warn({
          ip: context.request.ip,
          code: '#ERR_FF00'
        });
      }

      const permission: PermissionTypePayload = await group.permission.$expand(user, 'group');

      const queriedAdmins: Admin[] = await prisma.admins({ ...args });
      const result: Admin[] = [];

      if (permission.anyone.read) {
        return queriedAdmins;
      }

      queriedAdmins.forEach(async groupData => {
        // Filter out content that you don't have permission to browse.
        const relation: RelationPayload = await group.relation.$check(user, groupData.id, 'group');
        if ((permission.group.read && relation.isMember) || (permission.owner.read && relation.isOwner)) {
          result.push(groupData);
        }
        return;
      });

      return result;
    } catch (error) {
      // Write Log
      if (!/#ERR_/.test(error.message)) {
        log.error({
          ip: context.request.ip,
          code: '#ERR_FFFF',
          customResult: error.message
        });
      }

      throw new Error(error.message);
    }
  }
};

export default adminQuery;
