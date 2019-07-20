import { Context } from 'graphql-yoga/dist/types';
import { prisma, Item, ItemWhereUniqueInput, ItemWhereInput, ItemOrderByInput } from '../model';
import log from '../util/log';

const itemQuery = {
  async item(_: any, args: { where: ItemWhereUniqueInput }, context: Context): Promise<Item> {
    try {
      const targetItem: Item = await prisma.item(args.where);

      if (!targetItem) {
        // Write Log
        log.warn({
          ip: context.request.ip,
          result: '#ERR_I001: Item not found.'
        });

        return;
      }

      return targetItem;
    } catch (error) {
      // Write Log
      log.error({
        ip: context.request.ip,
        result: `#ERR_FFFF: Unexpected Error. ${error.message}`
      });

      throw new Error(error.message || '#ERR_FFFF');
    }
  },

  async items(
    _: any,
    args: {
      where?: ItemWhereInput;
      orderBy?: ItemOrderByInput;
      skip?: number;
      after?: string;
      before?: string;
      first?: number;
      last?: number;
    },
    context: Context
  ): Promise<Item[]> {
    try {
      return await prisma.items({ ...args });
    } catch (error) {
      // Write Log
      log.error({
        ip: context.request.ip,
        result: `#ERR_FFFF: Unexpected Error. ${error.message}`
      });

      throw new Error(error.message || '#ERR_FFFF');
    }
  }
};

export default itemQuery;
