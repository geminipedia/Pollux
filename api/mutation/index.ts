import groupMutation from './group';
import itemMutation from './item';
import newsMutation from './news';
import postMutation from './post';

const Mutation = {
  ...groupMutation,
  ...itemMutation,
  ...newsMutation,
  ...postMutation
};

export default Mutation;
