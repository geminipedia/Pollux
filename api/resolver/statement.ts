import { prisma, Statement, i18n, Entity, Property, FragmentableArray } from '../model';

const Statement = {
  property(parent: Statement): FragmentableArray<Property> {
    return prisma.statement({ id: parent.id }).property();
  },

  entity(parent: Statement): FragmentableArray<Entity> {
    return prisma.statement({ id: parent.id }).entity();
  }
};

export default Statement;
