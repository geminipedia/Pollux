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

      if (!user) {
        // Write Log
        await log.warn({
          ip: context.request.ip,
          code: '#ERR_FF00'
        });
      }

      if (!permission.owner.write) {
        // Write Log
        await log.warn({
          ip: context.request.ip,
          code: '#ERR_FF00',
          userId: user.id
        });

        throw new Error('#ERR_F000: Permission Deny.');
      }

      const itemExist: Item = await prisma.item({ itemId: args.data.itemId });

      if (itemExist) {
        // Write Log
        await log.warn({
          ip: context.request.ip,
          code: '#ERR_I000',
          customResult: `${itemExist.itemId} ${itemExist.name}`,
          userId: user.id
        });
      }
      // Write Log
      await log.write({
        ip: context.request.ip,
        customResult: `Item ${args.data.name} create successed.`,
        userId: user.id
      });

      return prisma.createItem(args.data);
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
  },

  async updateItem(_, args: { data: ItemUpdateInput, where: ItemWhereUniqueInput }, context: Context): Promise<Item> {
    const user: User = await auth.token.parse(context.request);

    try {
      if (!user) {
        // Write Log
        log.warn({
          ip: context.request.ip,
          code: '#ERR_FF00'
        });
      }

      const targetItem: Item = await prisma.item(args.where);

      if (!targetItem) {
        // Write Log
        log.warn({
          ip: context.request.ip,
          code: '#ERR_I001',
          userId: user.id
        });
      }

      const permission: PermissionTypePayload = await group.permission.$expand(user, 'item');
      const relation: RelationPayload = await group.relation.$check(user, targetItem.id, 'item');

      if (!(permission.anyone.write || (permission.group.write && relation.isMember) || (permission.owner.write && relation.isOwner))) {
        // Write Log
        log.warn({
          ip: context.request.ip,
          code: '#ERR_FF00',
          userId: user.id
        });
      }

      // Write Log
      await log.write({
        ip: context.request.ip,
        customResult: `Item ${targetItem.name} updated by ${user.displayName}.`,
        userId: user.id
      });

      return prisma.updateItem({ ...args });
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
  },

  async deleteItem(_, args: { where: ItemWhereUniqueInput }, context: Context): Promise<Item> {
    const user: User = await auth.token.parse(context.request);

    try {
      if (!user) {
        // Write Log
        log.warn({
          ip: context.request.ip,
          code: '#ERR_FF00'
        });

        return;
      }

      const targetItem: Item = await prisma.item(args.where);
      const permission: PermissionTypePayload = await group.permission.$expand(user, 'item');
      const relation: RelationPayload = await group.relation.$check(user, targetItem.id, 'item');

      if (!(permission.anyone.delete || (permission.group.delete && relation.isMember) || (permission.owner.delete && relation.isOwner))) {
        // Write Log
        log.warn({
          ip: context.request.ip,
          code: '#ERR_FF00',
          userId: user.id
        });

        return;
      }

      // Write Log
      await log.write({
        ip: context.request.ip,
        customResult: `Item ${targetItem.name} updated by ${user.displayName}.`,
        userId: user.id
      });

      return prisma.deleteItem(args.where);
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

export default itemMutation;
