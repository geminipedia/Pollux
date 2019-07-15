import { prisma, Reply, User, FragmentableArray } from '../model';

const Reply = {
  user(parent: Reply): FragmentableArray<User> {
    return prisma.reply({ id: parent.id }).user();
  },

  replies(parent: Reply): FragmentableArray<Reply> {
    return prisma.reply({ id: parent.id }).replies();
  }
};

export default Reply;
