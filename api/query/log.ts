import { Context } from 'graphql-yoga/dist/types';
import { prisma, Log, LogWhereUniqueInput, LogWhereInput, LogOrderByInput, User } from '../model';
import log from '../util/log';
import auth from '../auth';

const logQuery = {
  async log(_: any, args: { where: LogWhereUniqueInput }, context: Context): Promise<Log> {
    const user: User = await auth.token.parse(context.request);

    try {
      const accessable: boolean = await prisma.user({ id: user.id }).group().permission().log().owner().read() || await prisma.user({ id: user.id }).group().permission().log().anyone().read();
      const targetLog: Log = await prisma.log(args.where);
      const targetLogOwner: User = await prisma.log(args.where).user();


      if (!(accessable && targetLogOwner.id === user.id)) {
        // Write Log
        log.warn({
          ip: context.request.ip,
          result: '#ERR_F000: Permission Deny.',
          userId: user.id
        });

        return;
      }

      if (!targetLog) {
        // Write Log
        log.warn({
          ip: context.request.ip,
          result: '#ERR_L001: Log not found.',
          userId: user.id
        });

        return;
      }

      return targetLog;
    } catch (error) {
      // Write Log
      log.error({
        ip: context.request.ip,
        result: `#ERR_FFFF: Unexpected Error. ${error.message}`,
        userId: user.id
      });

      throw new Error(error.message || '#ERR_FFFF');
    }
  },

  async logs(
    _: any,
    args: {
      where?: LogWhereInput;
      orderBy?: LogOrderByInput;
      skip?: number;
      after?: string;
      before?: string;
      first?: number;
      last?: number;
    },
    context: Context
  ): Promise<Log[]> {
    const user: User = await auth.token.parse(context.request);

    try {
      const accessable: boolean = await prisma.user({ id: user.id }).group().permission().log().anyone().read();

      if (!accessable) {
        // Write Log
        log.warn({
          ip: context.request.ip,
          result: '#ERR_F000: Permission Deny.',
          userId: user.id
        });

        return;
      }

      return await prisma.logs({ ...args });
    } catch (error) {
      // Write Log
      log.error({
        ip: context.request.ip,
        result: `#ERR_FFFF: Unexpected Error. ${error.message}`,
        userId: user.id
      });

      throw new Error(error.message || '#ERR_FFFF');
    }
  }
};

export default logQuery;
