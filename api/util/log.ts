import { prisma, Log, Event, User, EventType } from '../model';

interface LogPayload {
  ip: Log['ip'];
  result: Event['result'];
  userId?: User['id'];
  meta?: Log['meta'];
}

const createLog = async (type: EventType, context: LogPayload) => {
  try {
    await prisma.createLog({
      ip: context.ip,
      event: {
        create: {
          type,
          result: context.result
        }
      },
      user: context.userId ? {
        connect: {
          id: context.userId
        }
      } : null
    });
  } catch (error) {
    throw new Error(error);
  }
};

const log = {
  error: async (context: LogPayload) => createLog('ERROR', context),
  warn: async (context: LogPayload) => createLog('WARNING', context),
  info: async (context: LogPayload) => createLog('INFO', context),
  write: async (context: LogPayload) => createLog('LOG', context)
};

export default log;
