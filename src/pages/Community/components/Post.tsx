import { updateLikes } from "@/apis/like.api";
import styles from "./post.module.css";
import CommunityPost from "@/components/CommunityPost";
import LikeButton from "@/components/LikeButton/LikeButton";
import { PostItem } from "@/types/post.type";
import userAuthStore from "@/zustand/userStore";
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
  const { userId } = userAuthStore();
  const { pathname } = useLocation();
  const { toast } = useToast();
  const qc = useQueryClient();
  const currentLikeStatus = useMemo(
    () => !!userId && post.likes.includes(userId),
    [post.likes, userId]
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
              if (post._id === postId) {
                const updatedLikes = likeStatus
                  ? [...post.likes, userId]
                  : post.likes.filter((id) => id !== userId);
                return { ...post, likes: updatedLikes };
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
    if (!userId) {
      toast({ type: "ERROR", description: "로그인이 필요합니다.😥" });
      return;
    }
    updateLikesMutate({ postId: post._id, likeStatus: !currentLikeStatus });
  };

  return (
    <>
      <li className={styles.post_wrapper}>
        <CommunityPost post={post} />
        <div
          className={styles.description}
          onClick={() =>
            pathname === "/community" && navigate(`/community/post/${post._id}`)
          }
        >
          {post.description}
        </div>
        <LikeButton
          likes={post.likes}
          currentLikeStatus={currentLikeStatus}
          handleClickLike={handleClickLike}
        />
      </li>
    </>
  );
};

export default Post;
