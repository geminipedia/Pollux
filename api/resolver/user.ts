import { prisma, User } from '../model';

const User = {
  avatar(parent: User) {
    return prisma.user({ id: parent.id }).avatar();
  },

  group(parent: User) {
    return prisma.user({ id: parent.id }).group();
  },

  logs(parent: User) {
    return prisma.user({ id: parent.id }).logs();
  }
};

export default User;
