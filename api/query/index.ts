import itemQuery from './item';
import propertyQuery from './property';
import postQuery from './post';
import newsQuery from './news';

const Query = {
  ...itemQuery,
  ...propertyQuery,
  ...postQuery,
  ...newsQuery
};

export default Query;
