import { useNavigate, useParams } from "react-router-dom";
import styles from "./postupdate.module.css";
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { multipleImageUpload } from "@/utils/imageUpload";
import { deletePostById, getPostById, updatePostById } from "@/apis/post.api";
import PostForm from "@/components/PostForm";
import { SubmitHandler } from "react-hook-form";
import { useEffect } from "react";
import userStore from "@/zustand/userStore";
import { PostFormFields } from "@/types/post.type";
import useToast from "@/components/UI/Toast/hooks/useToast";

const PostUpdatePage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = userStore();
  const { id } = useParams();
  const qc = useQueryClient();
  const { data: post } = useSuspenseQuery({
    queryKey: ["post", id],
    queryFn: () => id && getPostById(Number(id)),
    gcTime: 0,
  });

  const { mutateAsync: uploadImages } = useMutation({
    mutationFn: multipleImageUpload,
    onError: () => {
      toast({ type: "ERROR", description: "이미지 업로드에 실패하였습니다." });
    },
  });

  const { mutateAsync: submitForm } = useMutation({
    mutationFn: updatePostById,
    onSuccess: () => {
      toast({ type: "SUCCESS", description: "게시물을 수정 하였습니다." });
      qc.invalidateQueries({ queryKey: ["userPosts"] });
      navigate(`/community/post/${id}`, { replace: true });
    },
  });

  const { mutateAsync: deletePost } = useMutation({
    mutationFn: deletePostById,
    onSuccess: () => {
      toast({ type: "INFO", description: "게시물을 삭제 하였습니다." });
      qc.invalidateQueries({ queryKey: ["userPosts"] });
      navigate("/community");
    },
  });

  const handleUpdatePost: SubmitHandler<PostFormFields> = async ({
    tags,
    images,
    description,
  }) => {
    if (!id) return;
    const convertedImage = images.filter((image) => typeof image === "string");
    const filterdFile = images.filter((image) => image instanceof File);
    const uploadedImages = await uploadImages(filterdFile);
    const updatedImages = [...convertedImage, ...uploadedImages];
    await submitForm({
      id: Number(id),
      tags,
      images: updatedImages,
      description,
    });
  };

  const handleDeletePost = () => id && deletePost(Number(id));

  useEffect(() => {
    if (post?.creator.id !== user?.id) {
      throw new Error("게시글 수정 권한이 없습니다.");
    }
  }, [post]);

  return (
    <div className={styles.wrapper}>
      <PostForm
        requestType="update"
        onSubmit={handleUpdatePost}
        onClickDelete={handleDeletePost}
        post={post}
      />
    </div>
  );
};

export default PostUpdatePage;
