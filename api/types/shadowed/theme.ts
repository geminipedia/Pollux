import { Maybe, UUID, Json, ThemeType, ThemeTarget, ThemeWhereUniqueInput } from '../../model';
import { ShadowedUserCreateOneInput } from './user';
import { ShadowedImageCreateManyInput } from './image';

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

export interface ShadowedThemeCreateOneInput {
  create?: Maybe<ShadowedThemeCreateInput>;
  connect?: Maybe<ThemeWhereUniqueInput>;
}
