/* Post comment type */

export type CommentType = {
  _id: string;
  creator: {
    _id: string;
    name: string;
    email: string;
    nickName: string;
    image: string;
  };
  post: PostItem;
  description: string;
  reply: [];
  hasParent: boolean;
};

export type PostFormData = {
  tags: Array<string>;
  images: Array<string>;
  description: string;
  _id: string;
};

export type PostItem = PostFormData & {
  creator: {
    _id: string;
    name: string;
    email: string;
    nickName: string;
    image: string;
  };
  comments: [];
  likes: [];
  createdAt: Date;
};
