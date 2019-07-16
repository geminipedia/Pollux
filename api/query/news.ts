import { Context } from 'graphql-yoga/dist/types';

import { prisma, News, NewsWhereUniqueInput, NewsWhereInput, NewsOrderByInput, User } from '../model';
import group, { PermissionTypePayload, RelationPayload } from '../auth/group';
import log from '../util/log';
import auth from '../auth';

const newsQuery = {
  async news(_: any, args: { where: NewsWhereUniqueInput }, context: Context): Promise<News> {
    const viewer: User = await auth.token.parse(context.request);

    try {
      const targetNews: News = await prisma.news(args.where);
      const permission: PermissionTypePayload = await group.permission.$expand(viewer, 'news');
      const relation: RelationPayload = await group.relation.$check(viewer, targetNews.id, 'news');

      if (!targetNews.published && !(permission.anyone.read || (permission.group.read && relation.isMember) || (permission.owner.read && relation.isOwner))) {
        // Write Log
        log.warn({
          ip: context.request.ip,
          result: '#ERR_F000: Permission Deny.',
          userId: viewer.id
        });

        return;
      }

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
      const permission: PermissionTypePayload = await group.permission.$expand(viewer, 'news');

      const queriedNewses: News[] = await prisma.newses({ ...args });
      const result: News[] = [];

      if (permission.anyone.read) {
        return queriedNewses;
      }

      queriedNewses.forEach(async news => {
        if (news.published) {
          result.push(news);
          return;
        }
        // Filter out content that you don't have permission to browse.
        const relation: RelationPayload = await group.relation.$check(viewer, news.id, 'news');
        if ((permission.group.read && relation.isMember) || (permission.owner.read && relation.isOwner)) {
          result.push(news);
        }
        return;
      });

      return result;
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
