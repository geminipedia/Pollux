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
        log.error({
          ip: context.request.ip,
          result: `#ERR_FFFF Unexpected Error. ${error.message}`
        });
      }

      throw new Error(error.message || '#ERR_FFFF');
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
        log.error({
          ip: context.request.ip,
          result: `#ERR_FFFF Unexpected Error. ${error.message}`
        });
      }

      throw new Error(error.message || '#ERR_FFFF');
    }
  }
};

export default pageQuery;
