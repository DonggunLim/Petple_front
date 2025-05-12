import { useInfiniteQuery } from "@tanstack/react-query";
import styles from "./community.module.css";
import { useRef } from "react";
import { getPosts } from "@/apis/post.api";
import { PostItem } from "@/types/post.type";
import Post from "./components/Post";
import FloatingButton from "./components/FloatingButton";
import useInfinityScroll from "@/hooks/useInfinityScroll";

const CommunityPage = () => {
  const postContainerRef = useRef<HTMLUListElement>(null);
  const { data: posts, fetchNextPage } = useInfiniteQuery({
    queryKey: ["posts"],
    queryFn: ({ pageParam }) => getPosts(pageParam),
    select: (data) => {
      const posts = data.pages.map((page) => page.posts);
      const flattedPosts = posts.flat();
      return flattedPosts;
    },
    initialPageParam: 1,
    getNextPageParam: ({ pageInfo }) => pageInfo.nextPage,
  });

  const { targetRef } = useInfinityScroll({ cb: fetchNextPage });

  return (
    <section className={styles.wrapper}>
      <ul className={styles.post_container} ref={postContainerRef}>
        {posts?.map((post: PostItem) => (
          <Post post={post} key={`community-post-${post.id}`} />
        ))}
        <div ref={targetRef}></div>
      </ul>
      <FloatingButton />
    </section>
  );
};

export default CommunityPage;
