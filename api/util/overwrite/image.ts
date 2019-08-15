import { User } from '../../model';
import { ShadowedImageCreateInput, ShadowedImageUpdateManyInput } from '../../types/shadowed/image';
import overWrite from '.';

const image = {
  create: (
    data: ShadowedImageCreateInput | ShadowedImageCreateInput[],
    user: User
  ): ShadowedImageCreateInput | ShadowedImageCreateInput[] => {
    if (Array.isArray(data)) {
      return data.map(ele => {
        ele.file.create.uploadBy.connect = { id: user.id };
        return ele;
      });
    }

    data.file.create.uploadBy.connect = { id: user.id };
    return data;
  },

  update: (
    data: ShadowedImageUpdateManyInput,
    user: User
  ): ShadowedImageUpdateManyInput => {
    if (data.create) {
      data.create = overWrite.image.create(data.create, user);
    }

    if (data.upsert) {
      if (Array.isArray(data.upsert)) {
        data.upsert.map(ele => {
          if (ele.create && ele.create.file.create) {
            ele.create.file.create.uploadBy.connect = { id: user.id };
          }
          return ele;
        });
      } else {
        if (data.upsert.create) {
          data.upsert.create.file.create.uploadBy.connect = { id: user.id };
        }
      }
    }
    return data;
  }
};

export default image;
