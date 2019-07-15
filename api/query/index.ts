import itemQuery from './item';
import propertyQuery from './property';
import postQuery from './post';
import newsQuery from './news';
import groupQuery from './group';

const Query = {
  ...itemQuery,
  ...propertyQuery,
  ...postQuery,
  ...newsQuery,
  ...groupQuery
};

export default Query;
