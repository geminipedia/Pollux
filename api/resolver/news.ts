import { prisma, News, Image, Paragraph, Reply, Tag, User, FragmentableArray } from '../model';

const News = {
  author(parent: News): FragmentableArray<User> {
    return prisma.news({ id: parent.id }).author();
  },

  banner(parent: News): FragmentableArray<Image> {
    return prisma.news({ id: parent.id }).banner({ orderBy: 'createdAt_ASC' });
  },

  paragraphs(parent: News): FragmentableArray<Paragraph> {
    return prisma.news({ id: parent.id }).paragraphs({ orderBy: 'index_ASC' });
  },

  replies(parent: News): FragmentableArray<Reply> {
    return prisma.news({ id: parent.id }).replies({ orderBy: 'createdAt_ASC' });
  },

  tags(parent: News): FragmentableArray<Tag> {
    return prisma.news({ id: parent.id }).tags({ orderBy: 'createdAt_ASC' });
  }
};

export default News;
