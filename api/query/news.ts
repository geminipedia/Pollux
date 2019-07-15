import { Context } from 'graphql-yoga/dist/types';
import { prisma, News, NewsWhereUniqueInput, NewsWhereInput, NewsOrderByInput, User } from '../model';
import log from '../util/log';
import auth from '../auth';

const newsQuery = {
  async news(_: any, args: { where: NewsWhereUniqueInput }, context: Context): Promise<News> {
    const viewer: User = await auth.token.parse(context.request);

    try {
      const targetNews: News = await prisma.news(args.where);

      if (!targetNews) {
        // Write Log
        log.warn({
          ip: context.request.ip,
          result: '#ERR_N001: News not found.',
          userId: viewer.id
        });

        return;
      }

      return targetNews;
    } catch (error) {
      // Write Log
      log.error({
        ip: context.request.ip,
        result: `#ERR_FFFF: Unexpected Error. ${error.message}`,
        userId: viewer.id
      });

      throw new Error(error.message || '#ERR_FFFF');
    }
  },

  async newses({ _, args, context }:
    {
      _: any;
      args?: {
        where?: NewsWhereInput;
        orderBy?: NewsOrderByInput;
        skip?: number;
        after?: string;
        before?: string;
        first?: number;
        last?: number;
      };
      context: Context;
    }
  ): Promise<News[]> {
    const viewer: User = await auth.token.parse(context.request);

    try {
      return await prisma.newses({ ...args });
    } catch (error) {
      // Write Log
      log.error({
        ip: context.request.ip,
        result: `Unexpected Error. ${error.message}`,
        userId: viewer.id
      });

      throw new Error(error.message || '#ERR_FFFF');
    }
  }
};

export default newsQuery;
