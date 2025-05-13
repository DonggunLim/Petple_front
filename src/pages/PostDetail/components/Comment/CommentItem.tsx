import styles from "./comment.module.css";
import { Avartar } from "@/components";
import { CommentType } from "@/types/post.type";
import useUserStore from "@/zustand/userStore";
import { useMemo } from "react";
import ReplyList from "../Reply/ReplyList";
import { useCommentStore } from "@/zustand/commentStore";
import useCommentMutation from "@/hooks/useCommentMutation";

interface CommentItemProps {
  comment: CommentType;
}
const CommentItem = ({ comment }: CommentItemProps) => {
  const { creator, created_at } = comment;
  const { user: signinedUser } = useUserStore();
  const { postId, setTargetComment, setSubmitType, initState, resetForm } =
    useCommentStore();
  const { deleteComment } = useCommentMutation({ postId });
  const isEditable = useMemo(
    () => signinedUser?.id === comment.creator.id,
    [comment, signinedUser?.id]
  );
  const handleClickReply = () => {
    setTargetComment({ ...comment, content: "" });
  };

  const handleClickUpdate = () => {
    setSubmitType("UPDATE_COMMENT");
    setTargetComment(comment);
  };
  const handleClickDelete = () => {
    postId && deleteComment.mutate(comment.id);
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
              {creator.nickname}{" "}
              <span className={styles.comment_createdAt}>
                {new Date(created_at).toLocaleDateString()}
              </span>
            </p>
            <p className={styles.description}>{comment.content}</p>
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
        {comment.replies?.length > 0 && (
          <ReplyList replies={comment.replies} isEditable={isEditable} />
        )}
      </div>
    </>
  );
};

export default CommentItem;
