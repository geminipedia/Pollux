import itemQuery from './item';
import propertyQuery from './property';
import postQuery from './post';

const Query = {
  ...itemQuery,
  ...propertyQuery,
  ...postQuery
};

export default Query;
