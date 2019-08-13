import { Maybe, UUID, Json, Float, FileWhereUniqueInput } from '../../model';
import { ShadowedUserCreateOneInput, ShadowedUserUpdateOneRequiredInput } from './user';

export interface ShadowedFileCreateInput {
  id?: Maybe<UUID>;
  name: string;
  path: string;
  size?: Maybe<Float>;
  hidden?: Maybe<boolean>;
  uploadBy: ShadowedUserCreateOneInput;
  meta?: Maybe<Json>;
}

export interface ShadowedFileCreateOneInput {
  create?: Maybe<ShadowedFileCreateInput>;
  connect?: Maybe<FileWhereUniqueInput>;
}

export interface ShadowedFileUpdateOneInput {
  create?: Maybe<ShadowedFileCreateInput>;
  update?: Maybe<ShadowedFileUpdateDataInput>;
  upsert?: Maybe<ShadowedFileUpsertNestedInput>;
  delete?: Maybe<boolean>;
  disconnect?: Maybe<boolean>;
  connect?: Maybe<FileWhereUniqueInput>;
}

export interface ShadowedFileUpdateDataInput {
  name?: Maybe<string>;
  path?: Maybe<string>;
  size?: Maybe<Float>;
  hidden?: Maybe<boolean>;
  uploadBy?: Maybe<ShadowedUserUpdateOneRequiredInput>;
  meta?: Maybe<Json>;
}

export interface ShadowedFileUpsertNestedInput {
  update: ShadowedFileUpdateDataInput;
  create: ShadowedFileCreateInput;
}
