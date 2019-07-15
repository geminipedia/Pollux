import { prisma, Statement, i18n, Item, Property, FragmentableArray } from '../model';

const Statement = {
  i18n(parent: Statement): FragmentableArray<i18n> {
    return prisma.statement({ id: parent.id }).i18n();
  },

  property(parent: Statement): FragmentableArray<Property> {
    return prisma.statement({ id: parent.id }).property();
  },

  reference(parent: Statement): FragmentableArray<Item> {
    return prisma.statement({ id: parent.id }).reference();
  }
};

export default Statement;
