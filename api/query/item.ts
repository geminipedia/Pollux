import { Context } from 'graphql-yoga/dist/types';
import { Item, ItemWhereUniqueInput, ItemWhereInput } from '../model';

const itemQuery = {
  async item(_: any, args: ItemWhereUniqueInput, context: Context): Promise<Item> {
    try {
      const targetItem = await context.prisma.item(args);

      if (!targetItem) { throw new Error('#ERR_I001'); }

      return targetItem;
    } catch (err) {
      throw new Error(err.message || '#ERR_FFFF');
    }
  },

  async items(_: any, args: ItemWhereInput, context: Context): Promise<Item[]> {
    try {
      return await context.prisma.items(args);
    } catch (err) {
      throw new Error(err.message || '#ERR_FFFF');
    }
  }
};

export default itemQuery;
