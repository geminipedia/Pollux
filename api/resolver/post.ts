import { prisma, Post, Image, Paragraph, Reply, Tag, User, FragmentableArray } from '../model';

const Post = {
  author(parent: Post): FragmentableArray<User> {
    return prisma.post({ id: parent.id }).author();
  },

  banner(parent: Post): FragmentableArray<Image> {
    return prisma.post({ id: parent.id }).banner({ orderBy: 'createdAt_ASC' });
  },

  paragraphs(parent: Post): FragmentableArray<Paragraph> {
    return prisma.post({ id: parent.id }).paragraphs({ orderBy: 'index_ASC' });
  },

  replies(parent: Post): FragmentableArray<Reply> {
    return prisma.post({ id: parent.id }).replies({ orderBy: 'createdAt_ASC' });
  },

  tags(parent: Post): FragmentableArray<Tag> {
    return prisma.post({ id: parent.id }).tags({ orderBy: 'createdAt_ASC' });
  }
};

export default Post;
