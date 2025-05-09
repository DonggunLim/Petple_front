import { updateLikes } from "@/apis/like.api";
import styles from "./post.module.css";
import CommunityPost from "@/components/CommunityPost";
import LikeButton from "@/components/LikeButton/LikeButton";
import { PostItem } from "@/types/post.type";
import userStore from "@/zustand/userStore";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AxiosError } from "axios";
import useToast from "@/components/UI/Toast/hooks/useToast";

interface PostProps {
  post: PostItem;
}

const Post = ({ post }: PostProps) => {
  const navigate = useNavigate();
  const { user } = userStore();
  const { pathname } = useLocation();
  const { toast } = useToast();
  const qc = useQueryClient();
  const currentLikeStatus = useMemo(
    () => !!user?.id && post.likedUserIds.includes(user.id),
    [post.likedUserIds, user?.id]
  );

  const { mutate: updateLikesMutate } = useMutation({
    mutationFn: updateLikes,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["userLikePosts"] });
    },
    onMutate: ({ likeStatus, postId }) => {
      const prevPosts = qc.getQueryData(["posts"]);

      qc.setQueryData(["posts"], (prevPostsData: any) => {
        const newPosts = prevPostsData.pages.map(
          (page: { posts: PostItem[] }) => ({
            ...page,
            posts: page.posts.map((post: PostItem) => {
              if (post.id === Number(postId)) {
                const updatedLikes = likeStatus
                  ? [...post.likedUserIds, user?.id]
                  : post.likedUserIds.filter((id) => id !== user?.id);
                return {
                  ...post,
                  likedUserIds: updatedLikes,
                  likesCount: updatedLikes.length,
                };
              }

              return post;
            }),
          })
        );
        return {
          ...prevPostsData,
          pages: newPosts,
        };
      });

      return { prevPosts };
    },
    onError: (error: AxiosError, _variables, context) => {
      if (error.status === 401) {
        toast({ type: "ERROR", description: "로그인이 필요합니다.😥" });
      }
      qc.setQueryData(["posts"], context?.prevPosts);
    },
  });

  const handleClickLike = () => {
    if (!user?.id) {
      toast({ type: "ERROR", description: "로그인이 필요합니다.😥" });
      return;
    }
    updateLikesMutate({ postId: post.id, likeStatus: !currentLikeStatus });
  };
  return (
    <>
      <li className={styles.post_wrapper}>
        <CommunityPost post={post} />
        <div
          className={styles.description}
          onClick={() =>
            pathname === "/community" && navigate(`/community/post/${post.id}`)
          }
        >
          {post.description}
        </div>
        <LikeButton
          likedUserIds={post.likedUserIds}
          currentLikeStatus={currentLikeStatus}
          handleClickLike={handleClickLike}
        />
      </li>
    </>
  );
};

export default Post;
