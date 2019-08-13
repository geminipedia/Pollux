import { Context } from 'graphql-yoga/dist/types';

import { prisma, Post, PostCreateInput, User, PostUpdateInput, PostWhereUniqueInput } from '../model';
import group, { PermissionTypePayload, RelationPayload } from '../auth/group';
import log from '../util/log';
import auth from '../auth';

const postMutation = {
  async createPost(_, args: { data: PostCreateInput }, context: Context): Promise<Post> {
    const author: User = await auth.token.parse(context.request);

    try {
      const permission: PermissionTypePayload = await group.permission.$expand(author, 'post');

      if (!author) {
        // Write Log
        throw await log.warn({
          ip: context.request.ip,
          code: '#ERR_FF00'
        });
      }

      if (!permission.owner.write) {
        // Write Log
        throw await log.warn({
          ip: context.request.ip,
          code: '#ERR_FF00',
          userId: author.id
        });
      }

      // Write Log
      await log.write({
        ip: context.request.ip,
        customResult: `Post ${args.data.title} create successed.`,
        userId: author.id
      });

      return prisma.createPost(args.data);
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

  async updatePost(_, args: { data: PostUpdateInput, where: PostWhereUniqueInput }, context: Context): Promise<Post> {
    const author: User = await auth.token.parse(context.request);

    try {
      if (!author) {
        // Write Log
        throw await log.warn({
          ip: context.request.ip,
          code: '#ERR_FF00'
        });
      }

      const targetPost: Post = await prisma.post(args.where);

      if (!targetPost) {
        // Write Log
        throw await log.warn({
          ip: context.request.ip,
          code: '#ERR_M001',
          userId: author.id
        });
      }

      const permission: PermissionTypePayload = await group.permission.$expand(author, 'post');
      const relation: RelationPayload = await group.relation.$check(author, targetPost.id, 'post');

      if (!(permission.anyone.write || (permission.group.write && relation.isMember) || (permission.owner.write && relation.isOwner))) {
        // Write Log
        throw await log.warn({
          ip: context.request.ip,
          code: '#ERR_FF00',
          userId: author.id
        });
      }

      // Write Log
      await log.write({
        ip: context.request.ip,
        customResult: `Post ${targetPost.title} updated by ${author.displayName}.`,
        userId: author.id
      });

      return prisma.updatePost({ ...args });
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

  async deletePost(_, args: { where: PostWhereUniqueInput }, context: Context): Promise<Post> {
    const author: User = await auth.token.parse(context.request);

    try {
      if (!author) {
        // Write Log
        throw await log.warn({
          ip: context.request.ip,
          code: '#ERR_FF00'
        });
      }

      const targetPost: Post = await prisma.post(args.where);
      const permission: PermissionTypePayload = await group.permission.$expand(author, 'post');
      const relation: RelationPayload = await group.relation.$check(author, targetPost.id, 'post');

      if (!(permission.anyone.delete || (permission.group.delete && relation.isMember) || (permission.owner.delete && relation.isOwner))) {
        // Write Log
        throw await log.warn({
          ip: context.request.ip,
          code: '#ERR_FF00',
          userId: author.id
        });
      }

      // Write Log
      await log.write({
        ip: context.request.ip,
        customResult: `Post ${targetPost.title} updated by ${author.displayName}.`,
        userId: author.id
      });

      return prisma.deletePost(args.where);
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

export default postMutation;
