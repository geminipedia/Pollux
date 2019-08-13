import groupMutation from './group';
import itemMutation from './item';
import newsMutation from './news';
import postMutation from './post';
import adminMutation from './admin';

const Mutation = {
  ...groupMutation,
  ...itemMutation,
  ...newsMutation,
  ...postMutation,
  ...adminMutation
};

export default Mutation;
