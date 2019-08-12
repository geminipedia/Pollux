import itemQuery from './item';
import propertyQuery from './property';
import postQuery from './post';
import newsQuery from './news';
import groupQuery from './group';
import logQuery from './log';
import adminQuery from './admin';
import siteQuery from './site';
import pageQuery from './page';

const Query = {
  ...itemQuery,
  ...propertyQuery,
  ...postQuery,
  ...newsQuery,
  ...groupQuery,
  ...logQuery,
  ...adminQuery,
  ...siteQuery,
  ...pageQuery
};

export default Query;
