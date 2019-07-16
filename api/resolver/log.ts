import { prisma, Log, Image, User, FragmentableArray } from '../model';

const Log = {
  event(parent: Log): FragmentableArray<Image> {
    return prisma.log({ id: parent.id }).event();
  },

  user(parent: Log): FragmentableArray<User> {
    return prisma.log({ id: parent.id }).user();
  }
};

export default Log;
