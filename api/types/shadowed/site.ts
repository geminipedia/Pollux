import { Maybe, UUID, Json } from '../../model';
import { ShadowedPageCreateManyInput, ShadowedPageUpdateManyInput } from './page';
import { ShadowedUserCreateOneInput, ShadowedUserUpdateOneRequiredInput } from './user';

export interface ShadowedSiteCreateInput {
  id?: Maybe<UUID>;
  name: string;
  domain: string;
  menu?: Maybe<ShadowedPageCreateManyInput>;
  creator: ShadowedUserCreateOneInput;
  meta?: Maybe<Json>;
}

export interface ShadowedSiteUpdateInput {
  name: string;
  domain: string;
  menu?: Maybe<ShadowedPageUpdateManyInput>;
  creator: ShadowedUserUpdateOneRequiredInput;
  meta?: Maybe<Json>;
}
