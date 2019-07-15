import { prisma, Property, i18n, FragmentableArray, Log } from '../model/index';

const Property = {
  i18n(parent: Property): FragmentableArray<i18n> {
    return prisma.property({ id: parent.id }).i18n();
  },

  logs(parent: Property): FragmentableArray<Log> {
    return prisma.property({ id: parent.id }).logs({ orderBy: 'createdAt_ASC' });
  }
};

export default Property;
