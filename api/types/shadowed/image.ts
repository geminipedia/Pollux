import { Maybe, UUID, Json, ImageWhereUniqueInput, MeasurementCreateOneInput, MeasurementUpdateOneInput, ImageScalarWhereInput, ImageUpdateManyWithWhereNestedInput } from '../../model';
import { ShadowedFileCreateOneInput, ShadowedFileUpdateOneInput } from './file';

export interface ShadowedImageCreateInput {
  id?: Maybe<UUID>;
  name: string;
  description?: Maybe<string>;
  format?: Maybe<MeasurementCreateOneInput>;
  file?: Maybe<ShadowedFileCreateOneInput>;
  meta?: Maybe<Json>;
}

export interface ShadowedImageUpdateDataInput {
  name?: Maybe<string>;
  description?: Maybe<string>;
  format?: Maybe<MeasurementUpdateOneInput>;
  file?: Maybe<ShadowedFileUpdateOneInput>;
  meta?: Maybe<Json>;
}

export interface ShadowedImageCreateManyInput {
  create?: Maybe<ShadowedImageCreateInput[] | ShadowedImageCreateInput>;
  connect?: Maybe<ImageWhereUniqueInput[] | ImageWhereUniqueInput>;
}

export interface ShadowedImageUpdateManyInput {
  create?: Maybe<ShadowedImageCreateInput[] | ShadowedImageCreateInput>;
  update?: Maybe<
    | ShadowedImageUpdateWithWhereUniqueNestedInput[]
    | ShadowedImageUpdateWithWhereUniqueNestedInput
  >;
  upsert?: Maybe<
    | ShadowedImageUpsertWithWhereUniqueNestedInput[]
    | ShadowedImageUpsertWithWhereUniqueNestedInput
  >;
  delete?: Maybe<ImageWhereUniqueInput[] | ImageWhereUniqueInput>;
  connect?: Maybe<ImageWhereUniqueInput[] | ImageWhereUniqueInput>;
  set?: Maybe<ImageWhereUniqueInput[] | ImageWhereUniqueInput>;
  disconnect?: Maybe<ImageWhereUniqueInput[] | ImageWhereUniqueInput>;
  deleteMany?: Maybe<ImageScalarWhereInput[] | ImageScalarWhereInput>;
  updateMany?: Maybe<
    ImageUpdateManyWithWhereNestedInput[] | ImageUpdateManyWithWhereNestedInput
  >;
}

export interface ShadowedImageUpdateWithWhereUniqueNestedInput {
  where: ImageWhereUniqueInput;
  data: ShadowedImageUpdateDataInput;
}

export interface ShadowedImageUpsertWithWhereUniqueNestedInput {
  where: ImageWhereUniqueInput;
  update: ShadowedImageUpdateDataInput;
  create: ShadowedImageCreateInput;
}
