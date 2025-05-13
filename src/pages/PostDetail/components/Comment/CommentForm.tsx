import styles from "./comment.module.css";
import { Button } from "@/components";
import { CommentFormFields } from "@/types/post.type";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CommentSchema } from "@/consts/zodSchema";
import useUserStore from "@/zustand/userStore";
import useCommentMutation from "@/hooks/useCommentMutation";
import { useCommentStore } from "@/zustand/commentStore";
import { useEffect } from "react";
import useToast from "@/components/UI/Toast/hooks/useToast";

interface CommentFormProps {
  postId: number;
}

const CommentForm = ({ postId }: CommentFormProps) => {
  const { toast } = useToast();
  const { submitType, targetComment, initState, setResetForm } =
    useCommentStore();
  const { user } = useUserStore();
  const { register, handleSubmit, setValue, resetField } =
    useForm<CommentFormFields>({
      defaultValues: {
        content: "",
      },
      resolver: zodResolver(CommentSchema),
      mode: "onSubmit",
    });
  const { addComment, updateComment } = useCommentMutation({ postId });

  const onSubmit = ({ content }: CommentFormFields) => {
    if (!user) {
      toast({ type: "INFO", description: "로그인이 필요합니다." });
      return;
    }
    if (submitType === "ADD_COMMENT") {
      addComment.mutate({
        content,
        postId,
        parentId: targetComment?.id ?? null,
      });
    }

    if (submitType === "UPDATE_COMMENT" && targetComment?.id) {
      updateComment.mutate({ id: targetComment.id, content });
    }

    initState();
    resetField("content");
  };

  const resetDescriptionFiedls = () => resetField("content");

  useEffect(() => {
    if (targetComment?.content) {
      setValue("content", targetComment?.content);
    }
  }, [targetComment?.content]);

  useEffect(() => setResetForm(resetDescriptionFiedls), []);

  return (
    <form className={styles.comment_submit_form}>
      {targetComment && (
        <p className={styles.target_comment}>
          @{targetComment.creator.nickname}
        </p>
      )}
      <div className={styles.comment_input}>
        <input
          type="text"
          {...register("content")}
          placeholder="댓글을 작성해보세요."
        />
        <Button label="댓글" onClick={handleSubmit(onSubmit)} />
      </div>
    </form>
  );
};

export default CommentForm;
