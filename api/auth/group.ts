import { prisma, User, PermissionPromise, PermissionTypePromise, AccessPromise } from '../model';

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

export interface PermissionTypePayload {
  owner: AccessPayload;
  group: AccessPayload;
  anyone: AccessPayload;
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

const group = {
  permission: {
    $expand: async (user: User, key: PermissionKeyType):
      Promise<PermissionTypePayload> => {
      const targetPermission: PermissionPromise = group.permission.$queryDeliver.call(null, key, prisma.user({ id: user.id }).group().permission())();
      const targetPermissionType: PermissionTypePayloadPromise = group.permission.$nested.apply(null, [targetPermission, 'owner', 'group', 'anyone']);

      return {
        owner: await group.permission.$nested.apply(null, [targetPermissionType.owner, 'read', 'write', 'delete'])(),
        group: await group.permission.$nested.apply(null, [targetPermissionType.group, 'read', 'write', 'delete'])(),
        anyone: await group.permission.$nested.apply(null, [targetPermissionType.anyone, 'read', 'write', 'delete'])()
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
        result[key] = group.permission.$queryDeliver.call(null, key, callback)();
      });

      return result;
    }
  }
};

export default group;
