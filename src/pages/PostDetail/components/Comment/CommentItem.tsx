import styles from "./comment.module.css";
import { Avartar } from "@/components";
import { CommentType } from "@/types/post.type";
import userAuthStore from "@/zustand/userStore";
import { useMemo } from "react";
import ReplyList from "../Reply/ReplyList";
import { useCommentStore } from "@/zustand/commentStore";
import useCommentMutation from "@/hooks/useCommentMutation";

interface CommentItemProps {
  comment: CommentType;
}
const CommentItem = ({ comment }: CommentItemProps) => {
  const { creator, createdAt } = comment;
  const { userId: signinedUserId } = userAuthStore();
  const { postId, setTargetComment, setSubmitType, initState, resetForm } =
    useCommentStore();
  const { deleteComment } = useCommentMutation({ postId });
  const isEditable = useMemo(
    () => signinedUserId === comment.creator._id,
    [comment, signinedUserId]
  );
  const handleClickReply = () => {
    setTargetComment({ ...comment, description: "" });
    setSubmitType("ADD_REPLY");
  };

  const handleClickUpdate = () => {
    setSubmitType("UPDATE_COMMENT");
    setTargetComment(comment);
  };
  const handleClickDelete = () => {
    postId && deleteComment.mutate({ postId, commentId: comment._id });
    initState();
    resetForm?.();
  };
  return (
    <>
      <div className={styles.comments_wrapper}>
        <div className={styles.comment_body}>
          <Avartar
            image={comment.creator.profileImage}
            className={styles.avatar}
            creator={creator}
          />
          <div className={styles.main_wrapper}>
            <p>
              {creator.nickName}{" "}
              <span className={styles.comment_createdAt}>
                {new Date(createdAt).toLocaleDateString()}
              </span>
            </p>
            <p className={styles.description}>{comment.description}</p>
            <p className={styles.reply} onClick={handleClickReply}>
              답글
            </p>
          </div>
          {isEditable && (
            <div className={styles.actionmenu_wrapper}>
              <p onClick={handleClickUpdate}>수정</p>
              <p onClick={handleClickDelete}>삭제</p>
            </div>
          )}
        </div>
        {comment.replies.length > 0 && (
          <ReplyList
            comment={comment}
            replies={comment.replies}
            isEditable={isEditable}
          />
        )}
      </div>
    </>
  );
};

export default CommentItem;
