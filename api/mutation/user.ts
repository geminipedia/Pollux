import { Context } from 'graphql-yoga/dist/types';
import { User } from '../model/index';

const userMutation = {
  async login(_, args, context: Context): Promise<User> {
    try {
      return await context.prisma.user({ email: args.email });
    } catch (error) {
      throw new Error(error.message || '#ERR_FFFF');
    }
  }
};

export default userMutation;
