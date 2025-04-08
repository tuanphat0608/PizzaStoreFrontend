import {PostPrivacy, PostStatus} from "../common.enum";

export interface Post {
  id?: string;
  title?: string;
  content?: string;
  createdDate?: string;
  updatedDate?: string;
  categoryId?: string;
  view?: string;
  status?: PostStatus;
  version?: string;
  tag?: string;
  avatar?: string;
  privacy?: PostPrivacy;
  isOnTop?: boolean;
  schedule?: string;
}
