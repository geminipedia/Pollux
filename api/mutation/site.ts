import { Context } from 'graphql-yoga/dist/types';

import { prisma, Site, SiteCreateInput, User } from '../model';
import log from '../util/log';
import auth from '../auth';
import group, { PermissionTypePayload } from '../auth/group';

const siteMutation = {
  async createSite(_: any, args: { data: SiteCreateInput }, context: Context): Promise<Site> {
    try {
      const user: User = await auth.token.parse(context.request);

      if (!user) {
        // Write Log
        throw await log.warn({
          ip: context.request.ip,
          code: '#ERR_FF00'
        });
      }

      const permission: PermissionTypePayload = await group.permission.$expand(user, 'site');

      if (!permission.owner.write) {
        // Write Log
        throw await log.warn({
          ip: context.request.ip,
          code: '#ERR_FF00'
        });
      }

      const siteExist: Site = await prisma.site({ name: args.data.name });

      if (siteExist) {
        // Write Log
        throw await log.warn({
          ip: context.request.ip,
          code: '#ERR_B000',
          customResult: siteExist.name,
          userId: user.id
        });
      }

      // Write Log
      await log.write({
        ip: context.request.ip,
        customResult: `Site ${args.data.name} create successed.`,
        userId: user.id
      });

      return await prisma.createSite(args.data);
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

export default siteMutation;
