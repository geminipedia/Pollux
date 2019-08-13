import { User } from '../../model';
import { ShadowedImageCreateInput } from '../../types/shadowed/image';

const image = (
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
};

export default image;
