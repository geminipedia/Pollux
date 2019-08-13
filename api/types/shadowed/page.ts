import { Maybe, UUID, Json, PageType, Int, i18nCreateManyInput, PageHeadCreateOneInput, PageWhereUniqueInput, i18nUpdateManyInput, PageHeadUpdateOneRequiredInput, PageScalarWhereInput, PageUpdateManyWithWhereNestedInput } from '../../model';
import { ShadowedUserCreateOneInput, ShadowedUserUpdateOneRequiredInput } from './user';
import { ShadowedThemeCreateOneInput, ShadowedThemeUpdateOneRequiredInput } from './theme';

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

export interface ShadowedPageUpdateDataInput {
  path: string;
  name: string;
  type: PageType;
  index: Int;
  label: i18nUpdateManyInput;
  head: PageHeadUpdateOneRequiredInput;
  layout: ShadowedThemeUpdateOneRequiredInput;
  creator: ShadowedUserUpdateOneRequiredInput;
  meta: Json;
}

export interface ShadowedPageCreateManyInput {
  create?: Maybe<ShadowedPageCreateInput[] | ShadowedPageCreateInput>;
  connect?: Maybe<PageWhereUniqueInput[] | PageWhereUniqueInput>;
}


export interface ShadowedPageUpdateManyInput {
  create?: Maybe<ShadowedPageCreateInput[] | ShadowedPageCreateInput>;
  update?: Maybe<
    | ShadowedPageUpdateWithWhereUniqueNestedInput[]
    | ShadowedPageUpdateWithWhereUniqueNestedInput
  >;
  upsert?: Maybe<
    | ShadowedPageUpsertWithWhereUniqueNestedInput[]
    | ShadowedPageUpsertWithWhereUniqueNestedInput
  >;
  delete?: Maybe<PageWhereUniqueInput[] | PageWhereUniqueInput>;
  connect?: Maybe<PageWhereUniqueInput[] | PageWhereUniqueInput>;
  set?: Maybe<PageWhereUniqueInput[] | PageWhereUniqueInput>;
  disconnect?: Maybe<PageWhereUniqueInput[] | PageWhereUniqueInput>;
  deleteMany?: Maybe<PageScalarWhereInput[] | PageScalarWhereInput>;
  updateMany?: Maybe<
    PageUpdateManyWithWhereNestedInput[] | PageUpdateManyWithWhereNestedInput
  >;
}

export interface ShadowedPageUpdateWithWhereUniqueNestedInput {
  where: PageWhereUniqueInput;
  data: ShadowedPageUpdateDataInput;
}

export interface ShadowedPageUpsertWithWhereUniqueNestedInput {
  where: PageWhereUniqueInput;
  update: ShadowedPageUpdateDataInput;
  create: ShadowedPageCreateInput;
}
