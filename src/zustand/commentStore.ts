import { CommentSubmitType, CommentType } from "@/types/post.type";
import { create } from "zustand";

interface CommentStore {
  postId: number | null;
  targetComment: CommentType | null;
  submitType: CommentSubmitType;
  resetForm: () => void;

  setPostId: (postId: number) => void;
  setTargetComment: (targetComment: CommentType | null) => void;
  setSubmitType: (submitType: CommentSubmitType) => void;
  setResetForm: (resetFn: () => void) => void;
  initState: () => void;
}

export const useCommentStore = create<CommentStore>((set) => ({
  postId: null,
  targetComment: null,
  submitType: "ADD_COMMENT",
  resetForm: () => {},

  setPostId: (postId: number) => set({ postId }),
  setTargetComment: (targetComment: CommentType | null) =>
    set({ targetComment }),
  setSubmitType: (submitType: CommentSubmitType) => set({ submitType }),
  setResetForm: (resetFn: () => void) => set({ resetForm: resetFn }),
  initState: () =>
    set({
      submitType: "ADD_COMMENT",
      targetComment: null,
    }),
}));
