import { Maybe, UUID, Json, NoteWhereUniqueInput, NoteScalarWhereInput, NoteUpdateManyWithWhereNestedInput } from '../../model';
import { ShadowedUserCreateOneInput, ShadowedUserUpdateOneRequiredInput } from './user';

export interface ShadowedNoteCreateInput {
  id?: Maybe<UUID>;
  content?: Maybe<string>;
  user: ShadowedUserCreateOneInput;
  notes?: Maybe<ShadowedNoteCreateManyInput>;
  meta?: Maybe<Json>;
}

export interface ShadowedNoteUpdateDataInput {
  content?: Maybe<string>;
  user?: Maybe<ShadowedUserUpdateOneRequiredInput>;
  notes?: Maybe<ShadowedNoteUpdateManyInput>;
  meta?: Maybe<Json>;
}

export interface ShadowedNoteCreateManyInput {
  create?: Maybe<ShadowedNoteCreateInput[] | ShadowedNoteCreateInput>;
  connect?: Maybe<NoteWhereUniqueInput[] | NoteWhereUniqueInput>;
}

export interface ShadowedNoteUpdateManyInput {
  create?: Maybe<ShadowedNoteCreateInput[] | ShadowedNoteCreateInput>;
  update?: Maybe<
    | ShadowedNoteUpdateWithWhereUniqueNestedInput[]
    | ShadowedNoteUpdateWithWhereUniqueNestedInput
  >;
  upsert?: Maybe<
    | ShadowedNoteUpsertWithWhereUniqueNestedInput[]
    | ShadowedNoteUpsertWithWhereUniqueNestedInput
  >;
  delete?: Maybe<NoteWhereUniqueInput[] | NoteWhereUniqueInput>;
  connect?: Maybe<NoteWhereUniqueInput[] | NoteWhereUniqueInput>;
  set?: Maybe<NoteWhereUniqueInput[] | NoteWhereUniqueInput>;
  disconnect?: Maybe<NoteWhereUniqueInput[] | NoteWhereUniqueInput>;
  deleteMany?: Maybe<NoteScalarWhereInput[] | NoteScalarWhereInput>;
  updateMany?: Maybe<
    NoteUpdateManyWithWhereNestedInput[] | NoteUpdateManyWithWhereNestedInput
  >;
}

export interface ShadowedNoteUpdateWithWhereUniqueNestedInput {
  where: NoteWhereUniqueInput;
  data: ShadowedNoteUpdateDataInput;
}

export interface ShadowedNoteUpsertWithWhereUniqueNestedInput {
  where: NoteWhereUniqueInput;
  update: ShadowedNoteUpdateDataInput;
  create: ShadowedNoteCreateInput;
}
