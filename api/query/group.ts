import { Context } from 'graphql-yoga/dist/types';

import { prisma, Group, GroupWhereInput, GroupOrderByInput, GroupWhereUniqueInput, User } from '../model';
import group, { PermissionTypePayload, RelationPayload } from '../auth/group';
import log from '../util/log';
import auth from '../auth';

const groupQuery = {
  async group(_: any, args: { where: GroupWhereUniqueInput }, context: Context): Promise<Group> {
    const user: User = await auth.token.parse(context.request);

    try {
      const targetGroup: Group = await prisma.group(args.where);
      const permission: PermissionTypePayload = await group.permission.$expand(user, 'group');
      const relation: RelationPayload = await group.relation.$check(user, targetGroup.id, 'group');

      if (!(permission.anyone.read || (permission.group.read && relation.isMember) || (permission.owner.read && relation.isOwner))) {
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
      const permission: PermissionTypePayload = await group.permission.$expand(user, 'group');

      const queriedGroups: Group[] = await prisma.groups({ ...args });
      const result: Group[] = [];

      queriedGroups.forEach(async groupData => {
        // Filter out content that you don't have permission to browse.
        const relation: RelationPayload = await group.relation.$check(user, groupData.id, 'group');
        if (permission.anyone.read || (permission.group.read && relation.isMember) || (permission.owner.read && relation.isOwner)) {
          result.push(groupData);
        }
        return;
      });

      if (!permission.anyone.read) {
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
