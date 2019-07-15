import { prisma, Entity, Log, Item, i18n, FragmentableArray } from '../model';

const Entity = {
  i18n(parent: Entity): FragmentableArray<i18n> {
    return prisma.entity({ id: parent.id }).i18n();
  },

  reference(parent: Entity): FragmentableArray<Item> {
    return prisma.entity({ id: parent.id }).reference();
  },

  logs(parent: Entity): FragmentableArray<Log> {
    return prisma.entity({ id: parent.id }).logs({ orderBy: 'createdAt_ASC' });
  }
};

export default Entity;
