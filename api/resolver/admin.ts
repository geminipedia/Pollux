import { prisma, Admin, Page, FragmentableArray } from '../model';

const Admin = {
  menu(parent: Admin): FragmentableArray<Page> {
    return prisma.admin({ id: parent.id }).menu({ orderBy: 'index_ASC' });
  }
};

export default Admin;
