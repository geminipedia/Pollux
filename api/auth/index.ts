import group from './group';
import user from './user';
import token from './token';
import { sign, verify } from './key';

const auth = {
  group,
  user,
  sign,
  verify,
  token
};

export default auth;
