import styles from "./reply.module.css";
import Accordion from "@/components/UI/Accordion";
import { useState } from "react";
import ArrowDownIcon from "@/assets/icons/arrow_drop_down.svg?react";
import ArrowUpIcon from "@/assets/icons/arrow_drop_up.svg?react";
import { CommentType, ReplyType } from "@/types/post.type";
import { Avartar } from "@/components";
import useCommentMutation from "@/hooks/useCommentMutation";
import { useCommentStore } from "@/zustand/commentStore";

interface ReplyListProps {
  comment: CommentType;
  replies: ReplyType[];
  isEditable: boolean;
}

const ReplyList = ({ comment, replies, isEditable }: ReplyListProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const {
    postId,
    setSubmitType,
    setTargetReply,
    setTargetComment,
    resetForm,
    initState,
  } = useCommentStore();
  const { deleteReply } = useCommentMutation({ postId });
  const handleChangeOpen = (isOpen: boolean) => {
    setIsOpen(isOpen);
  };
  const handleClickUpdate = (reply: ReplyType) => {
    setSubmitType("UPDATE_REPLY");
    setTargetReply(reply);
    setTargetComment(comment);
  };
  const handleClickDelete = (replyId: string) => {
    deleteReply.mutate({ commentId: comment._id, replyId });
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
              <li key={`post-comment-${reply._id}`}>
                <div className={styles.comment_body}>
                  <Avartar
                    image={reply.profileImage}
                    className={styles.avatar}
                    creator={reply}
                  />
                  <div className={styles.main_wrapper}>
                    <p>
                      {reply.nickName}{" "}
                      <span className={styles.comment_createdAt}>
                        {new Date(reply.createdAt).toLocaleDateString()}
                      </span>
                    </p>
                    <p className={styles.description}>{reply.description}</p>
                  </div>
                  {isEditable && (
                    <div className={styles.actionmenu_wrapper}>
                      <p onClick={() => handleClickUpdate(reply)}>수정</p>
                      <p onClick={() => handleClickDelete(reply._id)}>삭제</p>
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
