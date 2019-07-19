import { Context } from 'graphql-yoga/dist/types';

import { prisma, Item, ItemCreateInput, User, ItemUpdateInput, ItemWhereUniqueInput } from '../model';
import group, { PermissionTypePayload, RelationPayload } from '../auth/group';
import log from '../util/log';
import auth from '../auth';

const itemMutation = {
  async createItem(_, args: { data: ItemCreateInput }, context: Context): Promise<Item> {
    const user: User = await auth.token.parse(context.request);

    try {
      const permission: PermissionTypePayload = await group.permission.$expand(user, 'item');

      if (!permission.owner.write) {
        // Write Log
        log.warn({
          ip: context.request.ip,
          result: '#ERR_F000: Permission Deny.',
          userId: user.id
        });

        return;
      }

      const itemExist: Item = await prisma.item({ itemId: args.data.itemId });

      if (itemExist) {
        // Write Log
        await log.warn({
          ip: context.request.ip,
          result: `Item ${itemExist.name} already existed.`,
          userId: user.id
        });

        throw new Error('#ERR_G000');
      }
      // Write Log
      await log.write({
        ip: context.request.ip,
        result: `Item ${args.data.name} create successed.`,
        userId: user.id
      });

      return prisma.createItem(args.data);
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

  async updateItem(_, args: { data: ItemUpdateInput, where: ItemWhereUniqueInput }, context: Context): Promise<Item> {
    const user: User = await auth.token.parse(context.request);

    try {
      const targetItem: Item = await prisma.item(args.where);
      const permission: PermissionTypePayload = await group.permission.$expand(user, 'item');
      const relation: RelationPayload = await group.relation.$check(user, targetItem.id, 'item');

      if (!(permission.anyone.write || (permission.group.write && relation.isMember) || (permission.owner.write && relation.isOwner))) {
        // Write Log
        log.warn({
          ip: context.request.ip,
          result: '#ERR_F000: Permission Deny.',
          userId: user.id
        });

        return;
      }

      // Write Log
      await log.write({
        ip: context.request.ip,
        result: `Item ${targetItem.name} updated by ${user.displayName}.`,
        userId: user.id
      });

      return prisma.updateItem({ ...args });
    } catch (err) {
      throw new Error(err.message || '#ERR_FFFF');
    }
  },

  async deleteItem(_, args: { where: ItemWhereUniqueInput }, context: Context): Promise<Item> {
    const user: User = await auth.token.parse(context.request);

    try {
      const targetItem: Item = await prisma.item(args.where);
      const permission: PermissionTypePayload = await group.permission.$expand(user, 'item');
      const relation: RelationPayload = await group.relation.$check(user, targetItem.id, 'item');

      if (!(permission.anyone.delete || (permission.group.delete && relation.isMember) || (permission.owner.delete && relation.isOwner))) {
        // Write Log
        log.warn({
          ip: context.request.ip,
          result: '#ERR_F000: Permission Deny.',
          userId: user.id
        });

        return;
      }

      // Write Log
      await log.write({
        ip: context.request.ip,
        result: `Item ${targetItem.name} updated by ${user.displayName}.`,
        userId: user.id
      });

      return prisma.deleteItem(args.where);
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

export default itemMutation;
