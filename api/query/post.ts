import { Context } from 'graphql-yoga/dist/types';
import { prisma, Post, PostWhereUniqueInput, PostWhereInput, PostOrderByInput, User } from '../model';
import log from '../util/log';
import auth from '../auth';

const postQuery = {
  async post(_: any, args: { where: PostWhereUniqueInput }, context: Context): Promise<Post> {
    const viewer: User = await auth.token.parse(context.request);

    try {
      const targetPost: Post = await prisma.post(args.where);

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

  async posts(
    _: any,
    args: {
      where?: PostWhereInput;
      orderBy?: PostOrderByInput;
      skip?: number;
      after?: string;
      before?: string;
      first?: number;
      last?: number;
    },
    context: Context
  ): Promise<Post[]> {
    const viewer: User = await auth.token.parse(context.request);

    try {
      return await prisma.posts(args);
    } catch (error) {
      // Write Log
      log.error({
        ip: context.request.ip,
        result: `#ERR_FFFF: Unexpected Error. ${error.message}`,
        userId: viewer.id
      });

      throw new Error(error.message || '#ERR_FFFF');
    }
  }
};

export default postQuery;
