import { Maybe, UUID, Json, PageType, Int, i18nCreateManyInput, PageHeadCreateOneInput, PageWhereUniqueInput } from '../../model';
import { ShadowedUserCreateOneInput } from './user';
import { ShadowedThemeCreateOneInput } from './theme';

export interface ShadowedPageCreateInput {
  id?: Maybe<UUID>;
  path: string;
  name: string;
  type: PageType;
  index?: Maybe<Int>;
  label?: Maybe<i18nCreateManyInput>;
  head: PageHeadCreateOneInput;
  layout: ShadowedThemeCreateOneInput;
  creator: ShadowedUserCreateOneInput;
  meta?: Maybe<Json>;
}

export interface ShadowedPageCreateManyInput {
  create?: Maybe<ShadowedPageCreateInput[] | ShadowedPageCreateInput>;
  connect?: Maybe<PageWhereUniqueInput[] | PageWhereUniqueInput>;
}

