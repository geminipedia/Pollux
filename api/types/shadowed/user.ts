import { Maybe, UserWhereUniqueInput, UserUpdateDataInput, UserUpsertNestedInput } from '../../model';

export interface ShadowedUserCreateOneInput {
  connect?: Maybe<UserWhereUniqueInput>;
}

export interface ShadowedUserUpdateOneRequiredInput {
  update?: Maybe<UserUpdateDataInput>;
  upsert?: Maybe<UserUpsertNestedInput>;
  connect?: Maybe<UserWhereUniqueInput>;
}
