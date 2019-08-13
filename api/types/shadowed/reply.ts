import { Maybe, UUID, Json, Int, ReplyWhereUniqueInput, ReplyScalarWhereInput, ReplyUpdateManyWithWhereNestedInput } from '../../model';
import { ShadowedUserCreateOneInput, ShadowedUserUpdateOneRequiredInput } from './user';

export interface ShadowedReplyCreateInput {
  id?: Maybe<UUID>;
  replyId: Int;
  content: string;
  user: ShadowedUserCreateOneInput;
  replies?: Maybe<ShadowedReplyCreateManyInput>;
  meta?: Maybe<Json>;
}

export interface ShadowedReplyUpdateDataInput {
  replyId?: Maybe<Int>;
  content?: Maybe<string>;
  user?: Maybe<ShadowedUserUpdateOneRequiredInput>;
  replies?: Maybe<ShadowedReplyUpdateManyInput>;
  meta?: Maybe<Json>;
}

export interface ShadowedReplyCreateManyInput {
  create?: Maybe<ShadowedReplyCreateInput[] | ShadowedReplyCreateInput>;
  connect?: Maybe<ReplyWhereUniqueInput[] | ReplyWhereUniqueInput>;
}

export interface ShadowedReplyUpdateManyInput {
  create?: Maybe<ShadowedReplyCreateInput[] | ShadowedReplyCreateInput>;
  update?: Maybe<
    | ShadowedReplyUpdateWithWhereUniqueNestedInput[]
    | ShadowedReplyUpdateWithWhereUniqueNestedInput
  >;
  upsert?: Maybe<
    | ShadowedReplyUpsertWithWhereUniqueNestedInput[]
    | ShadowedReplyUpsertWithWhereUniqueNestedInput
  >;
  delete?: Maybe<ReplyWhereUniqueInput[] | ReplyWhereUniqueInput>;
  connect?: Maybe<ReplyWhereUniqueInput[] | ReplyWhereUniqueInput>;
  set?: Maybe<ReplyWhereUniqueInput[] | ReplyWhereUniqueInput>;
  disconnect?: Maybe<ReplyWhereUniqueInput[] | ReplyWhereUniqueInput>;
  deleteMany?: Maybe<ReplyScalarWhereInput[] | ReplyScalarWhereInput>;
  updateMany?: Maybe<
    ReplyUpdateManyWithWhereNestedInput[] | ReplyUpdateManyWithWhereNestedInput
  >;
}

export interface ShadowedReplyUpdateWithWhereUniqueNestedInput {
  where: ReplyWhereUniqueInput;
  data: ShadowedReplyUpdateDataInput;
}

export interface ShadowedReplyUpsertWithWhereUniqueNestedInput {
  where: ReplyWhereUniqueInput;
  update: ShadowedReplyUpdateDataInput;
  create: ShadowedReplyCreateInput;
}

