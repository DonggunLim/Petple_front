import styles from "./comment.module.css";
import { Button } from "@/components";
import { CommentFormFields } from "@/types/post.type";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CommentSchema } from "@/consts/zodSchema";
import userAuthStore from "@/zustand/userStore";
import useCommentMutation from "@/hooks/useCommentMutation";
import { useCommentStore } from "@/zustand/commentStore";
import { useEffect } from "react";
import useToast from "@/components/UI/Toast/hooks/useToast";

interface CommentFormProps {
  postId: string;
}

const CommentForm = ({ postId }: CommentFormProps) => {
  const { toast } = useToast();
  const { submitType, targetComment, targetReply, initState, setResetForm } =
    useCommentStore();
  const user = userAuthStore();
  const { register, handleSubmit, setValue, resetField } =
    useForm<CommentFormFields>({
      defaultValues: {
        description: "",
      },
      resolver: zodResolver(CommentSchema),
      mode: "onSubmit",
    });
  const { addComment, addReply, updateComment, updateReply } =
    useCommentMutation({ postId });

  const onSubmit = ({ description }: CommentFormFields) => {
    if (!user) {
      toast({ type: "INFO", description: "로그인이 필요합니다." });
      return;
    }
    if (submitType === "ADD_COMMENT") {
      addComment.mutate({ description, postId, hasParent: false });
    }
    if (submitType === "ADD_REPLY" && targetComment) {
      addReply.mutate({
        targetCommentId: targetComment._id,
        description,
        tag: targetComment.creator._id,
      });
    }
    if (submitType === "UPDATE_COMMENT" && targetComment?._id) {
      updateComment.mutate({ _id: targetComment?._id, description, postId });
    }
    if (
      submitType === "UPDATE_REPLY" &&
      targetReply?._id &&
      targetComment?._id
    ) {
      updateReply.mutate({
        description,
        commentId: targetComment?._id,
        replyId: targetReply?._id,
      });
    }
    initState();
    resetField("description");
  };

  const resetDescriptionFiedls = () => resetField("description");

  useEffect(() => {
    if (targetComment?.description) {
      setValue("description", targetComment?.description);
    }
  }, [targetComment?.description]);

  useEffect(() => {
    if (targetReply?.description) {
      setValue("description", targetReply.description);
    }
  }, [targetReply?.description]);

  useEffect(() => setResetForm(resetDescriptionFiedls), []);

  return (
    <form className={styles.comment_submit_form}>
      {targetComment && (
        <p className={styles.target_comment}>
          @{targetComment.creator.nickName}
        </p>
      )}
      <div className={styles.comment_input}>
        <input
          type="text"
          {...register("description")}
          placeholder="댓글을 작성해보세요."
        />
        <Button label="댓글" onClick={handleSubmit(onSubmit)} />
      </div>
    </form>
  );
};

export default CommentForm;
