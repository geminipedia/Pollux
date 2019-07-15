import { prisma, Paragraph, FragmentableArray, Markup, Reply } from '../model';
import { Quote } from '../model/index';

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
