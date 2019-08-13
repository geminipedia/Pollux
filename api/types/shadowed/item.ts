import { Maybe, UUID, Json, i18nCreateManyInput, ItemWhereUniqueInput, i18nUpdateManyInput } from '../../model';
import { ShadowedImageCreateManyInput, ShadowedImageUpdateManyInput } from './image';
import { ShadowedParagraphCreateManyInput, ShadowedParagraphUpdateManyInput } from './paragraph';
import { ShadowedStatementCreateManyInput, ShadowedStatementUpdateManyInput } from './statement';
import { ShadowedUserCreateOneInput, ShadowedUserUpdateOneRequiredInput } from './user';
import { ShadowedLogCreateManyInput, ShadowedLogUpdateManyInput } from './log';

export interface ShadowedItemCreateInput {
  id?: Maybe<UUID>;
  itemId: string;
  name: string;
  i18n?: Maybe<i18nCreateManyInput>;
  images?: Maybe<ShadowedImageCreateManyInput>;
  introduction?: Maybe<ShadowedParagraphCreateManyInput>;
  statements?: Maybe<ShadowedStatementCreateManyInput>;
  logs?: Maybe<ShadowedLogCreateManyInput>;
  creator: ShadowedUserCreateOneInput;
  meta?: Maybe<Json>;
}

export interface ShadowedItemUpdateInput {
  itemId?: Maybe<string>;
  name?: Maybe<string>;
  i18n?: Maybe<i18nUpdateManyInput>;
  images?: Maybe<ShadowedImageUpdateManyInput>;
  introduction?: Maybe<ShadowedParagraphUpdateManyInput>;
  statements?: Maybe<ShadowedStatementUpdateManyInput>;
  logs?: Maybe<ShadowedLogUpdateManyInput>;
  creator?: Maybe<ShadowedUserUpdateOneRequiredInput>;
  meta?: Maybe<Json>;
}

export interface ShadowedItemUpdateDataInput {
  itemId?: Maybe<string>;
  name?: Maybe<string>;
  i18n?: Maybe<i18nUpdateManyInput>;
  images?: Maybe<ShadowedImageUpdateManyInput>;
  introduction?: Maybe<ShadowedParagraphUpdateManyInput>;
  statements?: Maybe<ShadowedStatementUpdateManyInput>;
  logs?: Maybe<ShadowedLogUpdateManyInput>;
  creator?: Maybe<ShadowedUserUpdateOneRequiredInput>;
  meta?: Maybe<Json>;
}

export interface ShadowedItemCreateOneInput {
  create?: Maybe<ShadowedItemCreateInput>;
  connect?: Maybe<ItemWhereUniqueInput>;
}

export interface ShadowedItemUpdateOneInput {
  create?: Maybe<ShadowedItemCreateInput>;
  update?: Maybe<ShadowedItemUpdateDataInput>;
  upsert?: Maybe<ShadowedItemUpsertNestedInput>;
  delete?: Maybe<boolean>;
  disconnect?: Maybe<boolean>;
  connect?: Maybe<ItemWhereUniqueInput>;
}

export interface ShadowedItemUpsertNestedInput {
  update: ShadowedItemUpdateDataInput;
  create: ShadowedItemCreateInput;
}
