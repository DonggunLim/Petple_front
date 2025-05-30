import styles from "./communitypost.module.css";
import { Avartar, Carousel } from "@/components";
import { PostItem } from "@/types/post.type";
import { useLocation, useNavigate } from "react-router-dom";
import { useMemo } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deletePostById } from "@/apis/post.api";
import useUserStore from "@/zustand/userStore";
import ClockIcon from "@/assets/icons/clock.svg?react";
import LikeIcon from "@/assets/icons/like.svg?react";
import CommentIcon from "@/assets/icons/comment.svg?react";
import { convertImageSrc } from "@/types/convertImageSrc";

interface PostProps {
  post: PostItem;
}

const CommunityPost = ({ post }: PostProps) => {
  const { creator, images, tags, created_at, id, commentsCount, likesCount } =
    post;
  return (
    <>
      <div key={`post-item-${id}`} className={styles.post}>
        <PostHeader
          creator={creator}
          tags={tags}
          created_at={created_at}
          commentsCount={commentsCount}
          likesCount={likesCount}
          postId={id}
        />
        {images.length > 0 && (
          <Carousel>
            <Carousel.ItemList>
              {images.map((src, index) => (
                <Carousel.Item key={index} index={index}>
                  <div className={styles.post_image_container}>
                    <img
                      src={convertImageSrc(src, "resized", "360x450")}
                      onError={(e) => (e.currentTarget.src = src)}
                      alt="게시글 이미지"
                      key={index}
                      className={styles.post_image}
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                </Carousel.Item>
              ))}
            </Carousel.ItemList>
            <Carousel.Indicator />
            <Carousel.Navigator />
          </Carousel>
        )}
      </div>
    </>
  );
};

export default CommunityPost;

const PostHeader = (
  data: Pick<PostItem, "creator" | "created_at" | "tags" | "commentsCount"> & {
    likesCount: number;
    postId: number;
  }
) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useUserStore();
  const { creator, tags, created_at, commentsCount, likesCount, postId } = data;
  const qc = useQueryClient();

  const isEditablePost = useMemo(
    () => location.pathname.includes("post") && creator.id === user?.id,
    [location]
  );
  const { mutate: deletePostMutate } = useMutation({
    mutationFn: deletePostById,
    onSuccess: () => {
      navigate("/community");
      qc.invalidateQueries({ queryKey: ["userPosts"] });
    },
  });
  return (
    <div className={styles.post_header}>
      {location.pathname.includes("post") && (
        <button className={styles.back_button} onClick={() => navigate(-1)}>
          <img src="/images/prev.png" alt="뒤로가기 버튼" />
        </button>
      )}
      <div className={styles.post_header_top}>
        <Avartar
          image={creator.profileImage}
          className={styles.avartar}
          creator={creator}
        />
        <div className={styles.post_header_userinfo_right}>
          <p className={styles.username}>
            {creator.name}
            <span className={styles.nickname}>{creator.nickname}</span>
          </p>
          <div className={styles.icons_list}>
            <div className={styles.createdAt}>
              <ClockIcon className={styles.icon} />
              {new Date(created_at).toLocaleDateString()}
            </div>
            <div className={styles.createdAt}>
              <CommentIcon className={styles.icon} />
              <span>{commentsCount}</span>
            </div>
            <div className={styles.createdAt}>
              <LikeIcon className={styles.icon} />
              <span>{likesCount}</span>
            </div>
          </div>
        </div>
        {isEditablePost && (
          <div className={styles.action_menu_wrapper}>
            <p onClick={() => navigate(`/community/update/${postId}`)}>수정</p>
            <p onClick={() => deletePostMutate(postId)}>삭제</p>
          </div>
        )}
      </div>
      <ul className={styles.tags_container}>
        {tags.map((tag, key) => (
          <li key={`tags-items-${key}`} className={styles.tag}>
            #{tag}
          </li>
        ))}
      </ul>
    </div>
  );
};
