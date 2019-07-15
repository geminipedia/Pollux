import { prisma, Site, Page, FragmentableArray } from '../model';

const Site = {
  menu(parent: Site): FragmentableArray<Page> {
    return prisma.site({ id: parent.id }).menu({ orderBy: 'index_ASC' });
  }
};

export default Site;
