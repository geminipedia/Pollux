import { prisma, Page, PageHead, PageMeta, Theme, User, i18n, FragmentableArray } from '../model';

const PageHead = {
  meta(parent: PageHead): FragmentableArray<PageMeta> {
    return prisma.pageHead({ id: parent.id }).meta();
  }
};

const Page = {
  label(parent: Page): FragmentableArray<i18n> {
    return prisma.page({ id: parent.id }).label();
  },

  head(parent: Page): FragmentableArray<PageHead> {
    return prisma.page({ id: parent.id }).head();
  },

  layout(parent: Page): FragmentableArray<Theme> {
    return prisma.page({ id: parent.id }).layout();
  },

  creator(parent: Page): FragmentableArray<User> {
    return prisma.page({ id: parent.id }).creator();
  }
};

export {
  Page,
  PageHead
};
