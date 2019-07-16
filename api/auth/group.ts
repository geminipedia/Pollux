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
  log: 'user'
};

const group = {
  permission: {
    $expand: async (user: User, key: PermissionKeyType):
      Promise<PermissionTypePayload> => {
      return {
        owner: {
          read: await group.permission.$queryDeliver.call(
            null,
            'read',
            group.permission.$queryDeliver.call(
              null,
              'owner',
              group.permission.$queryDeliver.call(
                null,
                key,
                prisma.user({ id: user.id }).group().permission()
              )
            )
          ),
          write: await group.permission.$queryDeliver.call(
            null,
            'write',
            group.permission.$queryDeliver.call(
              null,
              'owner',
              group.permission.$queryDeliver.call(
                null,
                key,
                prisma.user({ id: user.id }).group().permission()
              )
            )
          ),
          delete: await group.permission.$queryDeliver.call(
            null,
            'delete',
            group.permission.$queryDeliver.call(
              null,
              'owner',
              group.permission.$queryDeliver.call(
                null,
                key,
                prisma.user({ id: user.id }).group().permission()
              )
            )
          )
        },
        group: {
          read: await group.permission.$queryDeliver.call(
            null,
            'read',
            group.permission.$queryDeliver.call(
              null,
              'group',
              group.permission.$queryDeliver.call(
                null,
                key,
                prisma.user({ id: user.id }).group().permission()
              )
            )
          ),
          write: await group.permission.$queryDeliver.call(
            null,
            'write',
            group.permission.$queryDeliver.call(
              null,
              'group',
              group.permission.$queryDeliver.call(
                null,
                key,
                prisma.user({ id: user.id }).group().permission()
              )
            )
          ),
          delete: await group.permission.$queryDeliver.call(
            null,
            'delete',
            group.permission.$queryDeliver.call(
              null,
              'group',
              group.permission.$queryDeliver.call(
                null,
                key,
                prisma.user({ id: user.id }).group().permission()
              )
            )
          )
        },
        anyone: {
          read: await group.permission.$queryDeliver.call(
            null,
            'read',
            group.permission.$queryDeliver.call(
              null,
              'anyone',
              group.permission.$queryDeliver.call(
                null,
                key,
                prisma.user({ id: user.id }).group().permission()
              )
            )
          ),
          write: await group.permission.$queryDeliver.call(
            null,
            'write',
            group.permission.$queryDeliver.call(
              null,
              'anyone',
              group.permission.$queryDeliver.call(
                null,
                key,
                prisma.user({ id: user.id }).group().permission()
              )
            )
          ),
          delete: await group.permission.$queryDeliver.call(
            null,
            'delete',
            group.permission.$queryDeliver.call(
              null,
              'anyone',
              group.permission.$queryDeliver.call(
                null,
                key,
                prisma.user({ id: user.id }).group().permission()
              )
            )
          )
        }
      };
    },

    $queryDeliver: (
      key: PermissionKeyType | PermissionTypeKeyType | AccessKeyType,
      callback: PermissionPromise | PermissionTypePromise | AccessPromise
    ): PermissionTypePromise | AccessPromise => {
      return callback[key]();
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
          const target: { user: User, group: Group } = await group.relation.$handler.call(null, key, targetId);
          return {
            isOwner: target.user ? group.relation.$match(user.id, target.user.id) : false,
            isMember: target.group ? group.relation.$match(userGroup.id, target.group.id) : false
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
