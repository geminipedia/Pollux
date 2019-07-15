import { prisma, Paragraph, Markup, Reply, Quote, FragmentableArray } from '../model';

const Paragraph = {
  markup(parent: Paragraph): FragmentableArray<Markup> {
    return prisma.paragraph({ id: parent.id }).markup();
  },

  quotes(parent: Paragraph): FragmentableArray<Quote> {
    return prisma.paragraph({ id: parent.id }).quotes();
  },

  replies(parent: Paragraph): FragmentableArray<Reply> {
    return prisma.paragraph({ id: parent.id }).replies();
  }
};

export default Paragraph;
