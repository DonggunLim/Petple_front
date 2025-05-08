import styles from "./reply.module.css";
import Accordion from "@/components/UI/Accordion";
import { useState } from "react";
import ArrowDownIcon from "@/assets/icons/arrow_drop_down.svg?react";
import ArrowUpIcon from "@/assets/icons/arrow_drop_up.svg?react";
import { CommentType } from "@/types/post.type";
import { Avartar } from "@/components";
import useCommentMutation from "@/hooks/useCommentMutation";
import { useCommentStore } from "@/zustand/commentStore";

interface ReplyListProps {
  replies: CommentType[];
  isEditable: boolean;
}

const ReplyList = ({ replies, isEditable }: ReplyListProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { postId, setSubmitType, setTargetComment, resetForm, initState } =
    useCommentStore();
  const { deleteComment } = useCommentMutation({ postId });
  const handleChangeOpen = (isOpen: boolean) => {
    setIsOpen(isOpen);
  };
  const handleClickUpdate = (comment: CommentType) => {
    setSubmitType("UPDATE_COMMENT");
    setTargetComment(comment);
  };
  const handleClickDelete = (commentId: number) => {
    deleteComment.mutate(commentId);
    initState();
    resetForm();
  };

  return (
    <>
      <Accordion.Root
        className={styles.replies_wrapper}
        onChange={handleChangeOpen}
        defaultOpenStatus={isOpen}
      >
        <Accordion.Title>
          <Accordion.Button className={styles.replies_button}>
            <div className={styles.replies_title}>
              {isOpen ? <ArrowUpIcon /> : <ArrowDownIcon />}
              {replies.length}개의 답글 보기
            </div>
          </Accordion.Button>
        </Accordion.Title>
        <Accordion.Content>
          <ul className={styles.replies_list}>
            {replies.map((reply) => (
              <li key={`post-comment-${reply.id}`}>
                <div className={styles.comment_body}>
                  <Avartar
                    image={reply.creator.profileImage}
                    className={styles.avatar}
                    creator={reply.creator}
                  />
                  <div className={styles.main_wrapper}>
                    <p>
                      {reply.creator.nickname}{" "}
                      <span className={styles.comment_createdAt}>
                        {new Date(reply.created_at).toLocaleDateString()}
                      </span>
                    </p>
                    <p className={styles.description}>{reply.content}</p>
                  </div>
                  {isEditable && (
                    <div className={styles.actionmenu_wrapper}>
                      <p onClick={() => handleClickUpdate(reply)}>수정</p>
                      <p onClick={() => handleClickDelete(reply.id)}>삭제</p>
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </Accordion.Content>
      </Accordion.Root>
    </>
  );
};

export default ReplyList;
