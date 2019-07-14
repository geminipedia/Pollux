import { Context } from 'graphql-yoga/dist/types';
import { Item } from '../model/index';

const itemQuery = {
  async item(_, args, context: Context): Promise<Item> {
    try {
      const targetItem = await context.prisma.item(args);

      if (!targetItem) { throw new Error('#ERR_I001'); }

      return targetItem;
    } catch (err) {
      throw new Error(err.message || '#ERR_FFFF');
    }
  },

  async items(_, args, context: Context): Promise<Item[]> {
    try {
      return await context.prisma.items(args);
    } catch (err) {
      throw new Error(err.message || '#ERR_FFFF');
    }
  }
};

export default itemQuery;
