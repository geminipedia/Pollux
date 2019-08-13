import { Maybe, UUID, Json, StatementWhereUniqueInput, Int, StatementScalarWhereInput, StatementUpdateManyWithWhereNestedInput } from '../../model';
import { ShadowedPropertyCreateOneInput, ShadowedPropertyUpdateOneRequiredInput } from './property';
import { ShadowedEntityCreateOneInput, ShadowedEntityUpdateOneRequiredInput } from './entity';

export interface ShadowedStatementCreateInput {
  id?: Maybe<UUID>;
  index?: Maybe<Int>;
  entity: ShadowedEntityCreateOneInput;
  property: ShadowedPropertyCreateOneInput;
  meta?: Maybe<Json>;
}

export interface ShadowedStatementUpdateDataInput {
  index?: Maybe<Int>;
  entity?: Maybe<ShadowedEntityUpdateOneRequiredInput>;
  property?: Maybe<ShadowedPropertyUpdateOneRequiredInput>;
  meta?: Maybe<Json>;
}

export interface ShadowedStatementCreateManyInput {
  create?: Maybe<ShadowedStatementCreateInput[] | ShadowedStatementCreateInput>;
  connect?: Maybe<StatementWhereUniqueInput[] | StatementWhereUniqueInput>;
}

export interface ShadowedStatementUpdateManyInput {
  create?: Maybe<ShadowedStatementCreateInput[] | ShadowedStatementCreateInput>;
  update?: Maybe<
    | ShadowedStatementUpdateWithWhereUniqueNestedInput[]
    | ShadowedStatementUpdateWithWhereUniqueNestedInput
  >;
  upsert?: Maybe<
    | ShadowedStatementUpsertWithWhereUniqueNestedInput[]
    | ShadowedStatementUpsertWithWhereUniqueNestedInput
  >;
  delete?: Maybe<StatementWhereUniqueInput[] | StatementWhereUniqueInput>;
  connect?: Maybe<StatementWhereUniqueInput[] | StatementWhereUniqueInput>;
  set?: Maybe<StatementWhereUniqueInput[] | StatementWhereUniqueInput>;
  disconnect?: Maybe<StatementWhereUniqueInput[] | StatementWhereUniqueInput>;
  deleteMany?: Maybe<StatementScalarWhereInput[] | StatementScalarWhereInput>;
  updateMany?: Maybe<
    | StatementUpdateManyWithWhereNestedInput[]
    | StatementUpdateManyWithWhereNestedInput
  >;
}

export interface ShadowedStatementUpdateWithWhereUniqueNestedInput {
  where: StatementWhereUniqueInput;
  data: ShadowedStatementUpdateDataInput;
}

export interface ShadowedStatementUpsertWithWhereUniqueNestedInput {
  where: StatementWhereUniqueInput;
  update: ShadowedStatementUpdateDataInput;
  create: ShadowedStatementCreateInput;
}
