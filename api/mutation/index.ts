import groupMutation from './group';
import itemMutation from './item';

const Mutation = {
  ...groupMutation,
  ...itemMutation
};

export default Mutation;
