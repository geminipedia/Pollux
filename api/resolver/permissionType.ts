import { prisma, PermissionType, Access, FragmentableArray } from '../model';

const PermissionType = {
  owner(parent: PermissionType): FragmentableArray<Access> {
    return prisma.permissionType({ id: parent.id }).owner();
  },

  group(parent: PermissionType): FragmentableArray<Access> {
    return prisma.permissionType({ id: parent.id }).group();
  },

  anyone(parent: PermissionType): FragmentableArray<Access> {
    return prisma.permissionType({ id: parent.id }).anyone();
  }
};

export default PermissionType;
