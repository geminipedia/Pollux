import { Context } from 'graphql-yoga/dist/types';
import { prisma, Page, PageWhereUniqueInput, PageWhereInput, PageOrderByInput } from '../model';
import log from '../util/log';

const pageQuery = {
  async page(_: any, args: { where: PageWhereUniqueInput }, context: Context): Promise<Page> {
    try {
      return await prisma.page(args.where);
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

  async pages(
    _: any,
    args: {
      where?: PageWhereInput;
      orderBy?: PageOrderByInput;
      skip?: number;
      after?: string;
      before?: string;
      first?: number;
      last?: number;
    },
    context: Context
  ): Promise<Page[]> {
    try {
      return await prisma.pages({ ...args });
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
  }
};

export default pageQuery;
