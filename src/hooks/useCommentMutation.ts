import {
  addComment,
  addReply,
  deleteComment,
  deleteReply,
  updateComment,
  updateReply,
} from "@/apis/comment.api";
import useToast from "@/components/UI/Toast/hooks/useToast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";

interface useCommentMutationProps {
  postId: string | null;
}

const useCommentMutation = ({ postId }: useCommentMutationProps) => {
  const { toast } = useToast();
  const qc = useQueryClient();

  const onSuccess = () => {
    qc.invalidateQueries({ queryKey: ["Post", postId] });
  };
  const onError = (error: AxiosError) => {
    if (error.status === 401) {
      toast({
        type: "INFO",
        description: "로그인이 필요합니다.",
      });
    }
  };
  return {
    addComment: useMutation({ mutationFn: addComment, onSuccess, onError }),
    deleteComment: useMutation({
      mutationFn: deleteComment,
      onSuccess,
      onError,
    }),
    updateComment: useMutation({
      mutationFn: updateComment,
      onSuccess,
      onError,
    }),
    addReply: useMutation({ mutationFn: addReply, onSuccess, onError }),
    deleteReply: useMutation({ mutationFn: deleteReply, onSuccess, onError }),
    updateReply: useMutation({ mutationFn: updateReply, onSuccess, onError }),
  };
};

export default useCommentMutation;
