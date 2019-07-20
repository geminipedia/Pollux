import groupMutation from './group';
import itemMutation from './item';
import newsMutation from './news';

const Mutation = {
  ...groupMutation,
  ...itemMutation,
  ...newsMutation
};

export default Mutation;
