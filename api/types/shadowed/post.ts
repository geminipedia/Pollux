import { Maybe, UUID, DateTimeInput, Json, TagCreateManyInput, TagUpdateManyInput } from '../../model';
import { ShadowedUserCreateOneInput, ShadowedUserUpdateOneRequiredInput } from './user';
import { ShadowedImageCreateManyInput, ShadowedImageUpdateManyInput } from './image';
import { ShadowedParagraphCreateManyInput, ShadowedParagraphUpdateManyInput } from './paragraph';
import { ShadowedReplyCreateManyInput, ShadowedReplyUpdateManyInput } from './reply';

export interface ShadowedPostCreateInput {
  id?: Maybe<UUID>;
  title: string;
  published?: Maybe<boolean>;
  validUntil: DateTimeInput;
  author: ShadowedUserCreateOneInput;
  banner?: Maybe<ShadowedImageCreateManyInput>;
  paragraphs?: Maybe<ShadowedParagraphCreateManyInput>;
  replies?: Maybe<ShadowedReplyCreateManyInput>;
  tags?: Maybe<TagCreateManyInput>;
  meta?: Maybe<Json>;
}

export interface ShadowedPostUpdateInput {
  title?: Maybe<string>;
  published?: Maybe<boolean>;
  validUntil?: Maybe<DateTimeInput>;
  author?: Maybe<ShadowedUserUpdateOneRequiredInput>;
  banner?: Maybe<ShadowedImageUpdateManyInput>;
  paragraphs?: Maybe<ShadowedParagraphUpdateManyInput>;
  replies?: Maybe<ShadowedReplyUpdateManyInput>;
  tags?: Maybe<TagUpdateManyInput>;
  meta?: Maybe<Json>;
}
