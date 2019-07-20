import { Context } from 'graphql-yoga/dist/types';

import { prisma, Item, ItemCreateInput, User, ItemUpdateInput, ItemWhereUniqueInput } from '../model';
import group, { PermissionTypePayload, RelationPayload } from '../auth/group';
import log from '../util/log';
import auth from '../auth';

const itemMutation = {
  async createItem(_, args: { data: ItemCreateInput }, context: Context): Promise<Item> {
    const user: User = await auth.token.parse(context.request);

    try {
      if (!user) {
        // Write Log
        log.warn({
          ip: context.request.ip,
          result: '#ERR_F000: Permission Deny.'
        });

        throw new Error('#ERR_F000: Permission Deny.');
      }

      const permission: PermissionTypePayload = await group.permission.$expand(user, 'item');

      if (!permission.owner.write) {
        // Write Log
        log.warn({
          ip: context.request.ip,
          result: '#ERR_F000: Permission Deny.',
          userId: user.id
        });

        throw new Error('#ERR_F000: Permission Deny.');
      }

      const itemExist: Item = await prisma.item({ itemId: args.data.itemId });

      if (itemExist) {
        // Write Log
        await log.warn({
          ip: context.request.ip,
          result: `#ERR_I000 Item ${itemExist.name} already existed.`,
          userId: user.id
        });

        throw new Error(`#ERR_I000 Item ${itemExist.name} already existed.`);
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
      if (!/#ERR_/.test(error.message)) {
        log.error({
          ip: context.request.ip,
          result: `#ERR_FFFF Unexpected Error. ${error.message}`
        });
      }

      throw new Error(error.message || '#ERR_FFFF');
    }
  },

  async updateItem(_, args: { data: ItemUpdateInput, where: ItemWhereUniqueInput }, context: Context): Promise<Item> {
    const user: User = await auth.token.parse(context.request);

    try {
      if (!user) {
        // Write Log
        log.warn({
          ip: context.request.ip,
          result: '#ERR_F000: Permission Deny.'
        });

        throw new Error('#ERR_F000: Permission Deny.');
      }

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

        throw new Error('#ERR_F000: Permission Deny.');
      }

      // Write Log
      await log.write({
        ip: context.request.ip,
        result: `Item ${targetItem.name} updated by ${user.displayName}.`,
        userId: user.id
      });

      return prisma.updateItem({ ...args });
    } catch (error) {
      // Write Log
      if (!/#ERR_/.test(error.message)) {
        log.error({
          ip: context.request.ip,
          result: `#ERR_FFFF Unexpected Error. ${error.message}`
        });
      }

      throw new Error(error.message || '#ERR_FFFF');
    }
  },

  async deleteItem(_, args: { where: ItemWhereUniqueInput }, context: Context): Promise<Item> {
    const user: User = await auth.token.parse(context.request);

    try {
      if (!user) {
        // Write Log
        log.warn({
          ip: context.request.ip,
          result: '#ERR_F000: Permission Deny.'
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
      if (!/#ERR_/.test(error.message)) {
        log.error({
          ip: context.request.ip,
          result: `#ERR_FFFF Unexpected Error. ${error.message}`
        });
      }

      throw new Error(error.message || '#ERR_FFFF');
    }
  }
};

export default itemMutation;
