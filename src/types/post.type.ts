import { CommentSchema, postFormSchema } from "@/consts/zodSchema";
import { z } from "zod";

/* Post comment type */
export type ReplyType = {
  creatorId: string;
  name: string;
  nickName: string;
  profileImage: string;
  email: string;
  description: string;
  tag: string;
  hasParent: boolean;
  _id: string;
  createdAt: Date;
};

export type CommentType = {
  id: string;
  creator: {
    _id: string;
    name: string;
    email: string;
    nickName: string;
    profileImage: string;
  };
  post: PostItem;
  description: string;
  replies: ReplyType[];
  hasParent: boolean;
  createdAt: string;
};

export type PostFormData = {
  tags: Array<string>;
  images: Array<string>;
  description: string;
  id: string;
};

export type PostItem = PostFormData & {
  creator: {
    id: number;
    name: string;
    email: string;
    nickname: string;
    profileImage: string;
  };
  commentsCount: number;
  likesCount: number;
  created_at: Date;
  likedUserIds: number[];
};

export type CommentSubmitType =
  | "ADD_COMMENT"
  | "UPDATE_COMMENT"
  | "ADD_REPLY"
  | "UPDATE_REPLY";

export type PostFormFields = z.infer<typeof postFormSchema>;
export type CommentFormFields = z.infer<typeof CommentSchema>;
