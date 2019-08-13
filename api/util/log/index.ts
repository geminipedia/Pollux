import { prisma, Log, Event, User, EventType } from '../../model';
import fetchMsg, { FetchMessagePayload } from './fetchMsg';

interface LogPayload {
  ip: Log['ip'];
  code?: Event['code'];
  customResult?: Event['result'];
  userId?: User['id'];
  meta?: Log['meta'];
}

const createLog = async (type: EventType, context: LogPayload): Promise<void> => {
  try {
    let resultMsg: Event['result'];

    if (type === 'ERROR' || type === 'WARNING') {
      resultMsg = context.code ? fetchMsg(context.code, context.customResult).result : context.customResult;
    }

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
      throw new Error(`${context.code}: ${resultMsg}`);
    }
  } catch (error) {
    throw new Error(error);
  }
};

const log = {
  error: async (context: LogPayload): Promise<void> => createLog('ERROR', context),
  warn: async (context: LogPayload): Promise<void> => createLog('WARNING', context),
  info: async (context: LogPayload): Promise<void> => createLog('INFO', context),
  write: async (context: LogPayload): Promise<void> => createLog('LOG', context)
};

export default log;
