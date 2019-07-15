import { prisma, Image, File, Measurement, FragmentableArray } from '../model';

const Image = {
  file(parent: Image): FragmentableArray<File> {
    return prisma.image({ id: parent.id }).file();
  },

  format(parent: Image): FragmentableArray<Measurement> {
    return prisma.image({ id: parent.id }).format();
  }
};

export default Image;
