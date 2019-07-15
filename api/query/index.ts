import itemQuery from './item';
import propertyQuery from './property';
import postQuery from './post';
import newsQuery from './news';
import groupQuery from './group';
import logQuery from './log';

const Query = {
  ...itemQuery,
  ...propertyQuery,
  ...postQuery,
  ...newsQuery,
  ...groupQuery,
  ...logQuery
};

export default Query;
