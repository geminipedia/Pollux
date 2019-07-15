import { prisma, User, Image, Group, Log, FragmentableArray } from '../model';

const User = {
  avatar(parent: User): FragmentableArray<Image> {
    return prisma.user({ id: parent.id }).avatar();
  },

  group(parent: User): FragmentableArray<Group> {
    return prisma.user({ id: parent.id }).group();
  },

  logs(parent: User): FragmentableArray<Log> {
    return prisma.user({ id: parent.id }).logs();
  }
};

export default User;
