import { prisma } from '../model';

const Item = {
  introduction(parent) {
    return prisma.item({ id: parent.id }).introduction({ orderBy: 'index_ASC' });
  },

  statements(parent) {
    return prisma.item({ id: parent.id }).statements();
  }
};

export default Item;
