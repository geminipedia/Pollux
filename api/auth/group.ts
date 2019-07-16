import {
  prisma,
  PermissionPromise,
  PermissionTypePromise,
  AccessPromise,
  User,
  Post,
  News,
  Reply,
  Item,
  Property,
  Group,
  Theme,
  Log
} from '../model';

interface AccessPayload {
  read: boolean;
  write: boolean;
  delete: boolean;
}

interface AccessPayloadPromise {
  read: () => Promise<boolean>;
  write: () => Promise<boolean>;
  delete: () => Promise<boolean>;
}

interface PermissionTypePayloadPromise {
  owner: <T = AccessPayloadPromise>() => T;
  group: <T = AccessPayloadPromise>() => T;
  anyone: <T = AccessPayloadPromise>() => T;
}

type AccessKeyType =
  'read' |
  'write' |
  'delete'
  ;

type PermissionTypeKeyType =
  'owner' |
  'group' |
  'anyone'
  ;

type PermissionKeyType =
  'news' |
  'post' |
  'reply' |
  'item' |
  'property' |
  'user' |
  'group' |
  'layout' |
  'log' |
  'analytics'
  ;

export interface PermissionTypePayload {
  owner: AccessPayload;
  group: AccessPayload;
  anyone: AccessPayload;
}

export interface RelationPayload {
  isOwner: boolean;
  isMember: boolean;
}

const userFieldPair = {
  news: 'author',
  post: 'author',
  reply: 'user',
  item: 'creator',
  property: 'creator',
  theme: 'creator',
  log: 'user',
  user: 'self',
  group: 'self'
};

const group = {
  permission: {
    $expand: async (user: User, key: PermissionKeyType):
      Promise<PermissionTypePayload> => {
      const targetPermission: PermissionPromise = group.permission.$queryDeliver.call(null, key, prisma.user({ id: user.id }).group().permission());
      const targetPermissionType: PermissionTypePayloadPromise = group.permission.$nested.apply(null, [targetPermission, 'owner', 'group', 'anyone']);

      return {
        owner: await group.permission.$nested.apply(null, [targetPermissionType.owner, 'read', 'write', 'delete']),
        group: await group.permission.$nested.apply(null, [targetPermissionType.group, 'read', 'write', 'delete']),
        anyone: await group.permission.$nested.apply(null, [targetPermissionType.anyone, 'read', 'write', 'delete'])
      };
    },

    $queryDeliver: (
      key: PermissionKeyType | PermissionTypeKeyType | AccessKeyType,
      callback: PermissionPromise | PermissionTypePromise | AccessPromise
    ): PermissionTypePromise | AccessPromise => {
      return callback[key]();
    },

    $nested: (
      callback: PermissionPromise | PermissionTypePromise | AccessPromise,
      ...args: PermissionTypeKeyType[] | AccessKeyType[]
    ): PermissionTypePromise | AccessPromise => {
      const result = Object.create(null);
      Array.from(args).forEach(key => {
        result[key] = group.permission.$queryDeliver.call(null, key, callback);
      });

      return result;
    }
  },

  relation: {
    $check: async (
      user: User,
      targetId: News['id'] | Post['id'] | Reply['id'] | Item['id'] | Property['id'] | User['id'] | Group['id'] | Theme['id'] | Log['id'],
      key: PermissionKeyType
    ): Promise<RelationPayload> => {
      const userGroup: Group = await prisma.user({ id: user.id }).group();
      switch (key) {
        case 'user':
          const targetGroup: Group = await prisma.user({ id: targetId }).group();
          return {
            isOwner: group.relation.$match(user.id, targetId),
            isMember: group.relation.$match(userGroup.id, targetGroup.id)
          };
        case 'group':
          return {
            isOwner: false, // You haven't any group. "WE" have.
            isMember: group.relation.$match(userGroup.id, targetId)
          };
        default:
          const { targetOwner, targetOwnerGroup }: { targetOwner: User, targetOwnerGroup: Group } = await group.relation.$handler.call(null, key, targetId);
          return {
            isOwner: group.relation.$match(user.id, targetOwner.id),
            isMember: group.relation.$match(userGroup.id, targetOwnerGroup.id)
          };
      }
    },

    $handler: async (
      key: PermissionKeyType,
      targetId: News['id'] | Post['id'] | Reply['id'] | Item['id'] | Property['id'] | Theme['id'] | Log['id']
    ): Promise<{ user: User, group: Group }> => {
      return {
        user: await prisma[key]({ id: targetId })[userFieldPair[key]](),
        group: await prisma[key]({ id: targetId })[userFieldPair[key]]().group()
      };
    },

    $match: (id: User['id'] | Group['id'], compareId: User['id'] | Group['id']): boolean => {
      return id === compareId;
    }
  }
};

export default group;
