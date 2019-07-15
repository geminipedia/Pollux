import { User } from './model/index';

export interface UserSignPayload {
  id: User['id'];
  email: User['email'];
}

export interface UserKeyOptions {
  remember?: boolean;
}
