import { prisma, File, User, FragmentableArray } from '../model';

const File = {
  uploadBy(parent: File): FragmentableArray<User> {
    return prisma.file({ id: parent.id }).uploadBy();
  }
};

export default File;
