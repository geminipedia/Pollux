import { Context } from 'graphql-yoga/dist/types';
import { prisma, Item, ItemCreateInput, User } from '../model';
import log from '../util/log';
import auth from '../auth';
import group, { PermissionTypePayload } from '../auth/group';

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
    } catch (err) {
      throw new Error(err.message || '#ERR_FFFF');
    }
  }
};

export default itemMutation;
