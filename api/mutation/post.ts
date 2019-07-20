import { Context } from 'graphql-yoga/dist/types';

import { prisma, Post, PostCreateInput, User, PostUpdateInput, PostWhereUniqueInput } from '../model';
import group, { PermissionTypePayload, RelationPayload } from '../auth/group';
import log from '../util/log';
import auth from '../auth';

const postMutation = {
  async createPost(_, args: { data: PostCreateInput }, context: Context): Promise<Post> {
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

      const permission: PermissionTypePayload = await group.permission.$expand(author, 'post');

      if (!permission.owner.write) {
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
        result: `Post ${args.data.title} create successed.`,
        userId: author.id
      });

      return prisma.createPost(args.data);
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

  async updatePost(_, args: { data: PostUpdateInput, where: PostWhereUniqueInput }, context: Context): Promise<Post> {
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

      const targetPost: Post = await prisma.post(args.where);

      if (!targetPost) {
        // Write Log
        log.warn({
          ip: context.request.ip,
          result: '#ERR_P001: Post not found.',
          userId: author.id
        });

        throw new Error('#ERR_P001: Post not found.');
      }

      const permission: PermissionTypePayload = await group.permission.$expand(author, 'post');
      const relation: RelationPayload = await group.relation.$check(author, targetPost.id, 'post');

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
        result: `Post ${targetPost.title} updated by ${author.displayName}.`,
        userId: author.id
      });

      return prisma.updatePost({ ...args });
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

  async deletePost(_, args: { where: PostWhereUniqueInput }, context: Context): Promise<Post> {
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

      const targetPost: Post = await prisma.post(args.where);
      const permission: PermissionTypePayload = await group.permission.$expand(author, 'post');
      const relation: RelationPayload = await group.relation.$check(author, targetPost.id, 'post');

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
        result: `Post ${targetPost.title} updated by ${author.displayName}.`,
        userId: author.id
      });

      return prisma.deletePost(args.where);
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

export default postMutation;
