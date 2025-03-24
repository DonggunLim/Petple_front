import styles from "./popularposts.module.css";
import { getPopularPost } from "@/apis/post.api";
import { PostItem } from "@/types/post.type";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import ClockIcon from "@/assets/icons/clock.svg?react";
import LikeIcon from "@/assets/icons/like.svg?react";
import CommentIcon from "@/assets/icons/comment.svg?react";
import { convertImageSrc } from "@/types/convertImageSrc";

const rankEmojis = ["🥇", "🥈", "🥉"];

const convertRankToEmoji = (rank: number) => {
  return rankEmojis[rank - 1] ?? rank;
};

const PopularPosts = () => {
  const navigate = useNavigate();
  const { data: posts } = useSuspenseQuery<PostItem[]>({
    queryKey: ["PopularPosts"],
    queryFn: getPopularPost,
  });

  return (
    <section className={styles.wrapper}>
      <h1 className={styles.title}>
        🏆 인기 게시글 <span>TOP10</span>
      </h1>
      <ul className={styles.post_list_wrapper}>
        {posts.map((post, key) => (
          <li
            key={`post-item-${post._id}`}
            className={styles.post_item}
            onClick={() => navigate(`/community/post/${post._id}`)}
          >
            <div className={styles.rank}>{convertRankToEmoji(key + 1)}</div>
            <div className={styles.post_item_img_container}>
              <img
                src={convertImageSrc(post.images[0], "thumbnail", "70x70")}
                onError={(e) => (e.currentTarget.src = post.images[0])}
                alt="게시물 대표 이미지"
                loading="lazy"
                decoding="async"
              />
            </div>
            <div className={styles.post_item_info}>
              <span className={styles.nickname}>{post.creator.nickName}</span>

              <ul className={styles.tag_wrapper}>
                {post.tags.map((tag, index) => (
                  <li className={styles.tag} key={`tag-item-${index}`}>
                    #{tag}
                  </li>
                ))}
              </ul>
              <p className={styles.description}>{post.description}</p>

              <div className={styles.post_item_bottom}>
                <span className={styles.createdAt}>
                  <ClockIcon className={styles.icon} />
                  {new Date(post.createdAt).toLocaleDateString()}
                </span>
                <span className={styles.comment_count}>
                  <CommentIcon className={styles.icon} />
                  {post.comments.length}
                </span>
                <span className={styles.likes_count}>
                  <LikeIcon className={styles.icon} />
                  {post.likesCount}
                </span>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default PopularPosts;
