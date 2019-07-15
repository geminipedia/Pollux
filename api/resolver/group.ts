import { prisma, Group, Permission, FragmentableArray } from '../model';

const Group = {
  permission(parent: Group): FragmentableArray<Permission> {
    return prisma.group({ id: parent.id }).permission();
  }
};

export default Group;
