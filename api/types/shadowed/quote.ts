import { Maybe, UUID, Json, Int, QuoteWhereUniqueInput, QuoteType, QuoteScalarWhereInput, QuoteUpdateManyWithWhereNestedInput } from '../../model';
import { ShadowedUserCreateOneInput, ShadowedUserUpdateOneRequiredInput } from './user';
import { ShadowedNoteCreateManyInput, ShadowedNoteUpdateManyInput } from './note';
import { ShadowedReplyCreateManyInput, ShadowedReplyUpdateManyInput } from './reply';

export interface ShadowedQuoteCreateInput {
  id?: Maybe<UUID>;
  start?: Maybe<Int>;
  end?: Maybe<Int>;
  type?: Maybe<QuoteType>;
  user: ShadowedUserCreateOneInput;
  notes?: Maybe<ShadowedNoteCreateManyInput>;
  replies?: Maybe<ShadowedReplyCreateManyInput>;
  meta?: Maybe<Json>;
}

export interface ShadowedQuoteUpdateDataInput {
  start?: Maybe<Int>;
  end?: Maybe<Int>;
  type?: Maybe<QuoteType>;
  user?: Maybe<ShadowedUserUpdateOneRequiredInput>;
  notes?: Maybe<ShadowedNoteUpdateManyInput>;
  replies?: Maybe<ShadowedReplyUpdateManyInput>;
  meta?: Maybe<Json>;
}

export interface ShadowedQuoteCreateManyInput {
  create?: Maybe<ShadowedQuoteCreateInput[] | ShadowedQuoteCreateInput>;
  connect?: Maybe<QuoteWhereUniqueInput[] | QuoteWhereUniqueInput>;
}

export interface ShadowedQuoteUpdateManyInput {
  create?: Maybe<ShadowedQuoteCreateInput[] | ShadowedQuoteCreateInput>;
  update?: Maybe<
    | ShadowedQuoteUpdateWithWhereUniqueNestedInput[]
    | ShadowedQuoteUpdateWithWhereUniqueNestedInput
  >;
  upsert?: Maybe<
    | ShadowedQuoteUpsertWithWhereUniqueNestedInput[]
    | ShadowedQuoteUpsertWithWhereUniqueNestedInput
  >;
  delete?: Maybe<QuoteWhereUniqueInput[] | QuoteWhereUniqueInput>;
  connect?: Maybe<QuoteWhereUniqueInput[] | QuoteWhereUniqueInput>;
  set?: Maybe<QuoteWhereUniqueInput[] | QuoteWhereUniqueInput>;
  disconnect?: Maybe<QuoteWhereUniqueInput[] | QuoteWhereUniqueInput>;
  deleteMany?: Maybe<QuoteScalarWhereInput[] | QuoteScalarWhereInput>;
  updateMany?: Maybe<
    QuoteUpdateManyWithWhereNestedInput[] | QuoteUpdateManyWithWhereNestedInput
  >;
}

export interface ShadowedQuoteUpdateWithWhereUniqueNestedInput {
  where: QuoteWhereUniqueInput;
  data: ShadowedQuoteUpdateDataInput;
}

export interface ShadowedQuoteUpsertWithWhereUniqueNestedInput {
  where: QuoteWhereUniqueInput;
  update: ShadowedQuoteUpdateDataInput;
  create: ShadowedQuoteCreateInput;
}
