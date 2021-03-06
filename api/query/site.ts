import { Context } from 'graphql-yoga/dist/types';

import { Site, SiteWhereUniqueInput, prisma, SiteWhereInput, SiteOrderByInput } from '../model';
import log from '../util/log';

const siteQuery = {
  async site(_: any, args: { where: SiteWhereUniqueInput }, context: Context): Promise<Site> {
    try {
      return await prisma.site(args.where);
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

  async sites(
    _: any,
    args: {
      where?: SiteWhereInput;
      orderBy?: SiteOrderByInput;
      skip?: number;
      after?: string;
      before?: string;
      first?: number;
      last?: number;
    },
    context: Context
  ): Promise<Site[]> {
    try {
      return await prisma.sites({ ...args });
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

export default siteQuery;
