import { prisma, Item, Statement, FragmentableArray } from '../model';

const Item = {
  introduction(parent: Item): FragmentableArray<Item> {
    return prisma.item({ id: parent.id }).introduction({ orderBy: 'index_ASC' });
  },

  statements(parent: Item): FragmentableArray<Statement> {
    return prisma.item({ id: parent.id }).statements();
  }
};

export default Item;
