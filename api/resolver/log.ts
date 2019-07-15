import { prisma, Log, Image, Paragraph, Reply, Tag, User, FragmentableArray } from '../model';

const Log = {
  event(parent: Log): FragmentableArray<Image> {
    return prisma.log({ id: parent.id }).event();
  },

  user(parent: Log): FragmentableArray<User> {
    return prisma.log({ id: parent.id }).user();
  }
};

export default Log;
