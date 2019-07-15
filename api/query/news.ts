import { Context } from 'graphql-yoga/dist/types';
import { prisma, News, NewsWhereUniqueInput, NewsWhereInput, NewsOrderByInput, User } from '../model';
import log from '../util/log';
import auth from '../auth';

const newsQuery = {
  async news(_: any, args: NewsWhereUniqueInput, context: Context): Promise<News> {
    const viewer: User = await auth.token.parse(context.request);

    try {
      const targetNews: News = await prisma.news(args);

      if (!targetNews) {
        // Write Log
        log.warn({
          ip: context.request.ip,
          result: 'News not found.',
          userId: viewer.id
        });

        throw new Error('#ERR_N001');
      }

      return targetNews;
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
      return await prisma.newses(args);
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
