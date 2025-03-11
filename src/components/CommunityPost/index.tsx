import styles from "./communitypost.module.css";
import { Avartar, Carousel } from "@/components";
import { PostItem } from "@/types/post.type";
import { useLocation, useNavigate } from "react-router-dom";
import { useMemo } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deletePostById } from "@/apis/post.api";
import userAuthStore from "@/zustand/userAuth";
import ClockIcon from "@/assets/icons/clock.svg?react";
import LikeIcon from "@/assets/icons/like.svg?react";
import CommentIcon from "@/assets/icons/comment.svg?react";

interface PostProps {
  post: PostItem;
}

const CommunityPost = ({ post }: PostProps) => {
  const { creator, images, tags, createdAt, _id, comments, likes } = post;

  return (
    <>
      <div key={`post-item-${_id}`} className={styles.post}>
        <PostHeader
          creator={creator}
          tags={tags}
          createdAt={createdAt}
          commentsCount={comments.length}
          likesCount={likes.length}
          postId={_id}
        />
        {images.length > 0 && (
          <Carousel>
            <Carousel.ItemList>
              {images.map((src, index) => (
                <Carousel.Item key={index} index={index}>
                  <div className={styles.post_image_container}>
                    <img
                      src={src?.replace("images", "resized/images")}
                      onError={(e) => (e.currentTarget.src = src)}
                      alt="게시글 이미지"
                      key={index}
                      className={styles.post_image}
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
  data: Pick<PostItem, "creator" | "createdAt" | "tags"> & {
    commentsCount: number;
    likesCount: number;
    postId: string;
  }
) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { userId } = userAuthStore();
  const { creator, tags, createdAt, commentsCount, likesCount, postId } = data;
  const qc = useQueryClient();

  const isEditablePost = useMemo(
    () => location.pathname.includes("post") && creator._id === userId,
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
            <span className={styles.nickname}>{creator.nickName}</span>
          </p>
          <div className={styles.icons_list}>
            <div className={styles.createdAt}>
              <ClockIcon className={styles.icon} />
              {new Date(createdAt).toLocaleDateString()}
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
