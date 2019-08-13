import { Maybe, UUID, Json, ThemeType, ThemeTarget, ThemeWhereUniqueInput } from '../../model';
import { ShadowedUserCreateOneInput, ShadowedUserUpdateOneRequiredInput } from './user';
import { ShadowedImageCreateManyInput, ShadowedImageUpdateManyInput } from './image';

export interface ShadowedThemeCreateInput {
  id?: Maybe<UUID>;
  name: string;
  description?: Maybe<string>;
  component?: Maybe<string>;
  type?: Maybe<ThemeType>;
  target?: Maybe<ThemeTarget>;
  preview?: Maybe<ShadowedImageCreateManyInput>;
  creator: ShadowedUserCreateOneInput;
  meta?: Maybe<Json>;
}

export interface ShadowedThemeUpdateDataInput {
  name?: Maybe<string>;
  description?: Maybe<string>;
  component?: Maybe<string>;
  type?: Maybe<ThemeType>;
  target?: Maybe<ThemeTarget>;
  preview?: Maybe<ShadowedImageUpdateManyInput>;
  creator?: Maybe<ShadowedUserUpdateOneRequiredInput>;
  meta?: Maybe<Json>;
}

export interface ShadowedThemeCreateOneInput {
  create?: Maybe<ShadowedThemeCreateInput>;
  connect?: Maybe<ThemeWhereUniqueInput>;
}

export interface ShadowedThemeUpdateOneRequiredInput {
  create?: Maybe<ShadowedThemeCreateInput>;
  update?: Maybe<ShadowedThemeUpdateDataInput>;
  upsert?: Maybe<ShadowedThemeUpsertNestedInput>;
  connect?: Maybe<ThemeWhereUniqueInput>;
}

export interface ShadowedThemeUpsertNestedInput {
  update: ShadowedThemeUpdateDataInput;
  create: ShadowedThemeCreateInput;
}
