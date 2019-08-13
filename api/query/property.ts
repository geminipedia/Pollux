import { Context } from 'graphql-yoga/dist/types';
import { prisma, Property, PropertyWhereUniqueInput, PropertyWhereInput, PropertyOrderByInput, User } from '../model';
import log from '../util/log';
import auth from '../auth';

const propertyQuery = {
  async property(_: any, args: { where: PropertyWhereUniqueInput }, context: Context): Promise<Property> {
    try {
      return await prisma.property(args.where);
    } catch (error) {
      // Write Log
      if (!/#ERR_/.test(error.message)) {
        log.error({
          ip: context.request.ip,
          code: '#ERR_FFFF',
          customResult: error.message
        });
      }

      throw new Error(error.message);
    }
  },

  async properties(
    _: any,
    args: {
      where?: PropertyWhereInput;
      orderBy?: PropertyOrderByInput;
      skip?: number;
      after?: string;
      before?: string;
      first?: number;
      last?: number;
    },
    context: Context
  ): Promise<Property[]> {
    try {
      return await prisma.properties({ ...args });
    } catch (error) {
      // Write Log
      if (!/#ERR_/.test(error.message)) {
        log.error({
          ip: context.request.ip,
          code: '#ERR_FFFF',
          customResult: error.message
        });
      }

      throw new Error(error.message);
    }
  }
};

export default propertyQuery;
