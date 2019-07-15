import { prisma, Permission, PermissionType, FragmentableArray } from '../model';

const Permission = {
  news(parent: Permission): FragmentableArray<PermissionType> {
    return prisma.permission({ id: parent.id }).news();
  },

  post(parent: Permission): FragmentableArray<PermissionType> {
    return prisma.permission({ id: parent.id }).post();
  },

  reply(parent: Permission): FragmentableArray<PermissionType> {
    return prisma.permission({ id: parent.id }).reply();
  },

  item(parent: Permission): FragmentableArray<PermissionType> {
    return prisma.permission({ id: parent.id }).item();
  },

  property(parent: Permission): FragmentableArray<PermissionType> {
    return prisma.permission({ id: parent.id }).property();
  },

  user(parent: Permission): FragmentableArray<PermissionType> {
    return prisma.permission({ id: parent.id }).user();
  },

  group(parent: Permission): FragmentableArray<PermissionType> {
    return prisma.permission({ id: parent.id }).group();
  },

  layout(parent: Permission): FragmentableArray<PermissionType> {
    return prisma.permission({ id: parent.id }).layout();
  },

  log(parent: Permission): FragmentableArray<PermissionType> {
    return prisma.permission({ id: parent.id }).log();
  },

  analytics(parent: Permission): FragmentableArray<PermissionType> {
    return prisma.permission({ id: parent.id }).analytics();
  }
};

export default Permission;
