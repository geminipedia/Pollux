import { prisma, Quote, User, Note, Reply, FragmentableArray } from '../model';

const Quote = {
  user(parent: Quote): FragmentableArray<User> {
    return prisma.quote({ id: parent.id }).user();
  },

  notes(parent: Quote): FragmentableArray<Note> {
    return prisma.quote({ id: parent.id }).notes();
  },

  replies(parent: Quote): FragmentableArray<Reply> {
    return prisma.quote({ id: parent.id }).replies();
  }
};

export default Quote;
