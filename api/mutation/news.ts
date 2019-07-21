import { Context } from 'graphql-yoga/dist/types';

import { prisma, News, NewsCreateInput, User, NewsUpdateInput, NewsWhereUniqueInput } from '../model';
import group, { PermissionTypePayload, RelationPayload } from '../auth/group';
import log from '../util/log';
import auth from '../auth';

const newsMutation = {
  async createNews(_, args: { data: NewsCreateInput }, context: Context): Promise<News> {
    const author: User = await auth.token.parse(context.request);

    try {
      const permission: PermissionTypePayload = await group.permission.$expand(author, 'news');

      if (!author) {
        // Write Log
        await log.warn({
          ip: context.request.ip,
          result: '#ERR_F000: Permission Deny.'
        });

        throw new Error('#ERR_F000: Permission Deny.');
      }

      if (!permission.owner.write) {
        // Write Log
        await log.warn({
          ip: context.request.ip,
          result: '#ERR_F000: Permission Deny.',
          userId: author.id
        });

        throw new Error('#ERR_F000: Permission Deny.');
      }

      // Write Log
      await log.write({
        ip: context.request.ip,
        result: `News ${args.data.title} create successed.`,
        userId: author.id
      });

      return prisma.createNews(args.data);
    } catch (error) {
      // Write Log
      if (!/#ERR_/.test(error.message)) {
        await log.error({
          ip: context.request.ip,
          result: `#ERR_FFFF Unexpected Error. ${error.message}`
        });
      }

      throw new Error(error.message || '#ERR_FFFF');
    }
  },

  async updateNews(_, args: { data: NewsUpdateInput, where: NewsWhereUniqueInput }, context: Context): Promise<News> {
    const author: User = await auth.token.parse(context.request);

    try {
      if (!author) {
        // Write Log
        log.warn({
          ip: context.request.ip,
          result: '#ERR_F000: Permission Deny.'
        });

        throw new Error('#ERR_F000: Permission Deny.');
      }

      const targetNews: News = await prisma.news(args.where);

      if (!targetNews) {
        // Write Log
        log.warn({
          ip: context.request.ip,
          result: '#ERR_N001: News not found.',
          userId: author.id
        });

        throw new Error('#ERR_N001: News not found.');
      }

      const permission: PermissionTypePayload = await group.permission.$expand(author, 'news');
      const relation: RelationPayload = await group.relation.$check(author, targetNews.id, 'news');

      if (!(permission.anyone.write || (permission.group.write && relation.isMember) || (permission.owner.write && relation.isOwner))) {
        // Write Log
        log.warn({
          ip: context.request.ip,
          result: '#ERR_F000: Permission Deny.',
          userId: author.id
        });

        throw new Error('#ERR_F000: Permission Deny.');
      }

      // Write Log
      await log.write({
        ip: context.request.ip,
        result: `News ${targetNews.title} updated by ${author.displayName}.`,
        userId: author.id
      });

      return prisma.updateNews({ ...args });
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

  async deleteNews(_, args: { where: NewsWhereUniqueInput }, context: Context): Promise<News> {
    const author: User = await auth.token.parse(context.request);

    try {
      if (!author) {
        // Write Log
        log.warn({
          ip: context.request.ip,
          result: '#ERR_F000: Permission Deny.'
        });

        return;
      }

      const targetNews: News = await prisma.news(args.where);
      const permission: PermissionTypePayload = await group.permission.$expand(author, 'news');
      const relation: RelationPayload = await group.relation.$check(author, targetNews.id, 'news');

      if (!(permission.anyone.delete || (permission.group.delete && relation.isMember) || (permission.owner.delete && relation.isOwner))) {
        // Write Log
        log.warn({
          ip: context.request.ip,
          result: '#ERR_F000: Permission Deny.',
          userId: author.id
        });

        return;
      }

      // Write Log
      await log.write({
        ip: context.request.ip,
        result: `News ${targetNews.title} updated by ${author.displayName}.`,
        userId: author.id
      });

      return prisma.deleteNews(args.where);
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

export default newsMutation;
