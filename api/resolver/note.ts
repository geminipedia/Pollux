import { prisma, Note, User, FragmentableArray } from '../model';

const Note = {
  user(parent: Note): FragmentableArray<User> {
    return prisma.note({ id: parent.id }).user();
  },

  notes(parent: Note): FragmentableArray<Note> {
    return prisma.note({ id: parent.id }).notes();
  }
};

export default Note;
