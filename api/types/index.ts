import { User } from '../model';

export interface UserSignPayload {
  id: User['id'];
  email: User['email'];
}

export interface UserKeyOptions {
  remember?: boolean;
}
