import { Context } from 'graphql-yoga/dist/types';
import { prisma, Property, PropertyWhereUniqueInput, PropertyWhereInput, PropertyOrderByInput, User } from '../model';
import log from '../util/log';
import auth from '../auth';

const propertyQuery = {
  async property(_: any, args: PropertyWhereUniqueInput, context: Context): Promise<Property> {
    const viewer: User = await auth.token.parse(context.request);

    try {
      return await prisma.property(args);
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

  async properties({ _, args, context }:
    {
      _: any;
      args?: {
        where?: PropertyWhereInput;
        orderBy?: PropertyOrderByInput;
        skip?: number;
        after?: string;
        before?: string;
        first?: number;
        last?: number;
      };
      context: Context;
    }
  ): Promise<Property[]> {
    const viewer: User = await auth.token.parse(context.request);

    try {
      return await prisma.properties(args);
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

export default propertyQuery;
