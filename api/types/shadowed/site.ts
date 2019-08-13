import { Maybe, UUID, Json } from '../../model';
import { ShadowedPageCreateManyInput } from './page';
import { ShadowedUserCreateOneInput } from './user';

export interface ShadowedSiteCreateInput {
  id?: Maybe<UUID>;
  name: string;
  domain: string;
  menu?: Maybe<ShadowedPageCreateManyInput>;
  creator: ShadowedUserCreateOneInput;
  meta?: Maybe<Json>;
}
