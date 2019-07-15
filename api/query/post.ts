import { Context } from 'graphql-yoga/dist/types';
import { prisma, Post, PostWhereUniqueInput, PostWhereInput, PostOrderByInput, User } from '../model';
import log from '../util/log';
import auth from '../auth';

const postQuery = {
  async post(_: any, args: PostWhereUniqueInput, context: Context): Promise<Post> {
    const viewer: User = await auth.token.parse(context.request);

    try {
      const targetPost: Post = await prisma.post(args);

      if (!targetPost) {
        // Write Log
        log.warn({
          ip: context.request.ip,
          result: 'Post not found.',
          userId: viewer.id
        });

        throw new Error('#ERR_P001');
      }

      return targetPost;
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
      return await prisma.posts(args);
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
