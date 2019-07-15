import { prisma, Log, Event, User, EventType } from '../model';

interface LogPayload {
  ip: Log['ip'];
  result: Event['result'];
  userId?: User['id'];
  meta?: Log['meta'];
}

const createLog = async (type: EventType, context: LogPayload): Promise<void> => {
  try {
    if (!context.userId) {
      await prisma.createLog({
        ip: context.ip,
        event: {
          create: {
            type,
            result: context.result
          }
        }
      });
    } else {
      await prisma.createLog({
        ip: context.ip,
        event: {
          create: {
            type,
            result: context.result
          }
        },
        user: {
          connect: {
            id: context.userId
          }
        }
      });
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
