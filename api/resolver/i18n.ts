import { prisma, i18n, Lang, FragmentableArray } from '../model';

const i18n = {
  lang(parent: i18n): FragmentableArray<Lang> {
    return prisma.i18n({ id: parent.id }).lang();
  },

  i18n(parent: i18n): FragmentableArray<i18n> {
    return prisma.i18n({ id: parent.id }).i18n();
  }
};

export default i18n;
