import { CommentSchema, postFormSchema } from "@/consts/zodSchema";
import { z } from "zod";

/* Post comment type */
export type ReplyType = {
  creatorId: string;
  name: string;
  nickname: string;
  profileImage: string;
  email: string;
  description: string;
  tag: string;
  id: number;
  createdAt: Date;
};

export type CommentType = {
  id: number;
  post_id: number;
  creator: {
    id: number;
    name: string;
    email: string;
    nickname: string;
    profileImage: string;
  };
  content: string;
  replies: CommentType[];
  created_at: string;
};

export type PostFormData = {
  tags: Array<string>;
  images: Array<string>;
  description: string;
  id: number;
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

export type CommentSubmitType = "ADD_COMMENT" | "UPDATE_COMMENT";

export type PostFormFields = z.infer<typeof postFormSchema>;
export type CommentFormFields = z.infer<typeof CommentSchema>;
