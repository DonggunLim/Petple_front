import { CommentType } from "@/types/post.type";
import CommentList from "./CommentList";
import CommentForm from "./CommentForm";
import { useCommentStore } from "@/zustand/commentStore";
import { useEffect } from "react";

interface CommentProps {
  comments: CommentType[];
  postId: number;
}

const Comment = ({ comments, postId }: CommentProps) => {
  const { setPostId } = useCommentStore();
  useEffect(() => {
    setPostId(postId);
  }, [postId]);
  return (
    <>
      <CommentList comments={comments} />
      <CommentForm postId={postId} />
    </>
  );
};

export default Comment;
