import { Context } from 'graphql-yoga/dist/types';

import { prisma, Post, PostWhereUniqueInput, PostWhereInput, PostOrderByInput, User } from '../model';
import group, { PermissionTypePayload, RelationPayload } from '../auth/group';
import log from '../util/log';
import auth from '../auth';

const postQuery = {
  async post(_: any, args: { where: PostWhereUniqueInput }, context: Context): Promise<Post> {
    const viewer: User = await auth.token.parse(context.request);

    try {
      const targetPost: Post = await prisma.post(args.where);
      const permission: PermissionTypePayload = await group.permission.$expand(viewer, 'post');
      const relation: RelationPayload = await group.relation.$check(viewer, targetPost.id, 'post');

      if (!targetPost.published && !(permission.anyone.read || (permission.group.read && relation.isMember) || (permission.owner.read && relation.isOwner))) {
        // Write Log
        log.warn({
          ip: context.request.ip,
          result: '#ERR_F000: Permission Deny.',
          userId: viewer.id
        });

        return;
      }

      if (!targetPost) {
        // Write Log
        log.warn({
          ip: context.request.ip,
          result: '#ERR_P001: Post not found.',
          userId: viewer.id
        });

        return;
      }

      return targetPost;
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

  async posts({ _, args, context }:
    {
      _: any;
      args?: {
        where?: PostWhereInput;
        orderBy?: PostOrderByInput;
        skip?: number;
        after?: string;
        before?: string;
        first?: number;
        last?: number;
      };
      context: Context;
    }
  ): Promise<Post[]> {
    const viewer: User = await auth.token.parse(context.request);

    try {
      const permission: PermissionTypePayload = await group.permission.$expand(viewer, 'post');

      const queriedPosts: Post[] = await prisma.posts({ ...args });
      const result: Post[] = [];

      if (permission.anyone.read) {
        return queriedPosts;
      }

      queriedPosts.forEach(async post => {
        if (post.published) {
          result.push(post);
          return;
        }
        // Filter out content that you don't have permission to browse.
        const relation: RelationPayload = await group.relation.$check(viewer, post.id, 'post');
        if ((permission.group.read && relation.isMember) || (permission.owner.read && relation.isOwner)) {
          result.push(post);
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

export default postQuery;
