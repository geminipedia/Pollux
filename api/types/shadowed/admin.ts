import { Maybe, UUID, Json } from '../../model';
import { ShadowedPageCreateManyInput, ShadowedPageUpdateManyInput } from './page';
import { ShadowedUserCreateOneInput, ShadowedUserUpdateOneRequiredInput } from './user';

export interface ShadowedAdminCreateInput {
  id?: Maybe<UUID>;
  name: string;
  domain: string;
  public?: Maybe<boolean>;
  menu?: Maybe<ShadowedPageCreateManyInput>;
  creator: ShadowedUserCreateOneInput;
  meta?: Maybe<Json>;
}

export interface ShadowedAdminUpdateInput {
  name: string;
  domain: string;
  public?: Maybe<boolean>;
  menu?: Maybe<ShadowedPageUpdateManyInput>;
  creator: ShadowedUserUpdateOneRequiredInput;
  meta?: Maybe<Json>;
}
