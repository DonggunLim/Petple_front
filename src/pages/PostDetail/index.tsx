import styles from "./postdetail.module.css";
import { getPostById } from "@/apis/post.api";
import CommunityPost from "@/components/CommunityPost";
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import Comment from "./components/Comment/Comment";
import { useMemo } from "react";
import userStore from "@/zustand/userStore";
import LikeButton from "../../components/LikeButton/LikeButton";
import Header from "@/components/Header";
import { AxiosError } from "axios";
import { updateLikes } from "@/apis/like.api";
import useToast from "@/components/UI/Toast/hooks/useToast";
import { Helmet } from "react-helmet-async";

const PostDetailPage = () => {
  const { toast } = useToast();
  const qc = useQueryClient();
  const { user } = userStore();
  const { id: postId } = useParams();
  const { data: post } = useSuspenseQuery({
    queryKey: ["Post", Number(postId)],
    queryFn: () => postId && getPostById(Number(postId)),
  });

  const currentLikeStatus = useMemo(
    () => !!user?.id && post.likedUserIds.includes(user.id),
    [post.likedUserIds, user?.id]
  );

  const inValidateQuery = () =>
    qc.invalidateQueries({ queryKey: ["Post", Number(postId)] });

  const { mutate: updateLikesMutate } = useMutation({
    mutationFn: updateLikes,
    onSuccess: () => {
      inValidateQuery();
      qc.invalidateQueries({ queryKey: ["userLikePosts"] });
    },
    onError: (error: AxiosError) => {
      if (error.status === 401) {
        toast({
          type: "INFO",
          description: "로그인이 필요합니다.",
        });
      }
    },
  });

  const handleClickLike = () => {
    if (!postId) return;
    if (!user?.id) {
      toast({
        type: "INFO",
        description: "로그인이 필요합니다.",
      });
      return;
    }
    updateLikesMutate({
      postId: Number(postId),
      likeStatus: !currentLikeStatus,
    });
  };

  return (
    <div className={styles.wrraper}>
      <Helmet>
        <title>{`${post.creator?.nickName}의 게시글 | PetPle`}</title>
        <meta
          name="description"
          content={`${post.tags.join("")}에 대한 게시글`}
        />
      </Helmet>
      <Header />
      <CommunityPost post={post} />
      <div className={styles.description}>{post.description}</div>
      <LikeButton
        likedUserIds={post.likedUserIds}
        currentLikeStatus={currentLikeStatus}
        handleClickLike={handleClickLike}
      />
      <Comment comments={post.comments} postId={post.id} />
    </div>
  );
};

export default PostDetailPage;
