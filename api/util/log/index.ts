import { prisma, Log, Event, User, EventType } from '../../model';
import fetchMsg, { FetchMessagePayload } from './fetchMsg';

interface LogPayload {
  ip: Log['ip'];
  code?: Event['code'];
  customResult?: Event['result'];
  userId?: User['id'];
  meta?: Log['meta'];
}

const createLog = async (type: EventType, context: LogPayload): Promise<void | Error> => {
  try {
    let resultMsg: Event['result'];

    resultMsg = context.code ? fetchMsg(context.code, context.customResult).result : context.customResult;

    if (!context.userId) {
      await prisma.createLog({
        ip: context.ip,
        event: {
          create: {
            type,
            code: context.code,
            result: resultMsg
          }
        }
      });
    } else {
      await prisma.createLog({
        ip: context.ip,
        event: {
          create: {
            type,
            code: context.code,
            result: resultMsg
          }
        },
        user: {
          connect: {
            id: context.userId
          }
        }
      });
    }

    if (type === 'ERROR' || type === 'WARNING') {
      return new Error(`${context.code}: ${resultMsg}`);
    }
  } catch (error) {
    return new Error(error.message);
  }
};

const log = {
  error: async (context: LogPayload): Promise<void | Error> => createLog('ERROR', context),
  warn: async (context: LogPayload): Promise<void | Error> => createLog('WARNING', context),
  info: async (context: LogPayload): Promise<void | Error> => createLog('INFO', context),
  write: async (context: LogPayload): Promise<void | Error> => createLog('LOG', context)
};

export default log;
