import { Maybe, UUID, Json, i18nCreateManyInput, EntityWhereUniqueInput, i18nUpdateManyInput } from '../../model';
import { ShadowedItemCreateOneInput, ShadowedItemUpdateOneInput } from './item';
import { ShadowedLogCreateManyInput, ShadowedLogUpdateManyInput } from './log';

export interface ShadowedEntityCreateInput {
  id?: Maybe<UUID>;
  value: string;
  i18n?: Maybe<i18nCreateManyInput>;
  reference?: Maybe<ShadowedItemCreateOneInput>;
  logs?: Maybe<ShadowedLogCreateManyInput>;
  meta?: Maybe<Json>;
}

export interface ShadowedEntityUpdateDataInput {
  value?: Maybe<string>;
  i18n?: Maybe<i18nUpdateManyInput>;
  reference?: Maybe<ShadowedItemUpdateOneInput>;
  logs?: Maybe<ShadowedLogUpdateManyInput>;
  meta?: Maybe<Json>;
}

export interface ShadowedEntityCreateOneInput {
  create?: Maybe<ShadowedEntityCreateInput>;
  connect?: Maybe<EntityWhereUniqueInput>;
}

export interface ShadowedEntityUpdateOneRequiredInput {
  create?: Maybe<ShadowedEntityCreateInput>;
  update?: Maybe<ShadowedEntityUpdateDataInput>;
  upsert?: Maybe<ShadowedEntityUpsertNestedInput>;
  connect?: Maybe<EntityWhereUniqueInput>;
}

export interface ShadowedEntityUpsertNestedInput {
  update: ShadowedEntityUpdateDataInput;
  create: ShadowedEntityCreateInput;
}
