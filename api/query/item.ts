import { Context } from 'graphql-yoga/dist/types';
import { prisma, Item, ItemWhereUniqueInput, ItemWhereInput, ItemOrderByInput, User } from '../model';
import log from '../util/log';
import auth from '../auth';

const itemQuery = {
  async item(_: any, args: ItemWhereUniqueInput, context: Context): Promise<Item> {
    const viewer: User = await auth.token.parse(context.request);

    try {
      const targetItem: Item = await prisma.item(args);

      if (!targetItem) {
        // Write Log
        log.warn({
          ip: context.request.ip,
          result: 'Item not found.',
          userId: viewer.id
        });

        throw new Error('#ERR_I001');
      }

      return targetItem;
    } catch (error) {
      // Write Log
      log.error({
        ip: context.request.ip,
        result: `Unexpected Error. ${error.message}`,
        userId: viewer.id
      });

      throw new Error(error.message || '#ERR_FFFF');
    }
  },

  async items({ _, args }:
    {
      _: any;
      args?: {
        where?: ItemWhereInput;
        orderBy?: ItemOrderByInput;
        skip?: number;
        after?: string;
        before?: string;
        first?: number;
        last?: number;
      };
    }
  ): Promise<Item[]> {
    try {
      return await prisma.items(args);
    } catch (error) {
      throw new Error(error.message || '#ERR_FFFF');
    }
  }
};

export default itemQuery;
