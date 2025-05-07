import { Button, Tabs } from "@/components";
import style from "../profile.module.css";
import Pagination from "@/components/UI/Pagination";
import { useState } from "react";

import { useNavigate } from "react-router-dom";
import { getLikePosts, getUserPosts } from "@/apis/post.api";
import userStore from "@/zustand/userStore";
import { useQuery } from "@tanstack/react-query";
import { PostItem } from "@/types/post.type";

const UserPosts = () => {
  const { user } = userStore();
  const [currentPostsPage, setCurrentPostsPage] = useState<number>(1);
  const [currentLikePage, setCurrentLikePage] = useState<number>(1);
  const { data } = useQuery({
    queryKey: ["userPosts", currentPostsPage],
    queryFn: () => getUserPosts(user?.nickname!, currentPostsPage),
    staleTime: 1000 * 60 * 1,
  });

  const { data: likePostsData } = useQuery({
    queryKey: ["userLikePosts", currentLikePage],
    queryFn: () => getLikePosts(user?.nickname!, currentLikePage),
    staleTime: 1000 * 60 * 1,
  });

  const posts: PostItem[] = data?.userPosts.posts || [];
  const totalPage: number = data?.userPosts.totalPages || 1;
  const likePosts: PostItem[] = likePostsData?.likePosts.posts || [];
  const totalLikePage: number = likePostsData?.likePosts.totalPages || 1;

  const [activeIndex, setActiveIndex] = useState(1);
  const navigate = useNavigate();

  return (
    <Tabs.Root className={style.tabs_root}>
      <Tabs.MenuList className={style.tabs_menulist}>
        <Tabs.Menu index={1}>
          <Button
            className={`${style.tabs_button} ${
              activeIndex === 1 ? style.active : ""
            }`}
            onClick={() => setActiveIndex(1)}
          >
            작성한 게시글
          </Button>
        </Tabs.Menu>
        <Tabs.Menu index={2}>
          <Button
            className={`${style.tabs_button} ${
              activeIndex === 2 ? style.active : ""
            }`}
            onClick={() => setActiveIndex(2)}
          >
            좋아요 게시글
          </Button>
        </Tabs.Menu>
      </Tabs.MenuList>
      <Tabs.MenuList>
        <Tabs.Pannel index={1} className={style.pennel_div}>
          {posts.length > 0 ? (
            posts.map((post) => (
              <div
                key={post._id}
                className={style.pennel_img_div}
                onClick={() => navigate(`/community/post/${post._id}`)}
              >
                {post.images.length > 0 ? (
                  <img
                    src={post.images[0]}
                    className={style.tabs_img}
                    alt="내 게시물 이미지"
                  />
                ) : (
                  <div className={style.tabs_img}>{post.description}</div>
                )}

                <div className={style.info}>
                  <div className={style.comment}>
                    <img src={"/images/comment_white.png"} alt="게시물 댓글" />
                    {post.comments.length}
                  </div>
                  <div className={style.likes}>
                    <img src={"/images/like_white.png"} alt="게시물 좋아요" />
                    {post.likes.length}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p>작성한 게시글이 없습니다.</p>
          )}
          {posts.length > 0 && (
            <Pagination
              page={currentPostsPage}
              totalPages={totalPage}
              startPage={1}
              endPage={totalPage}
              setPage={setCurrentPostsPage}
              className={style.pagination}
            >
              <Pagination.Navigator type="prev" />
              <Pagination.PageButtons />
              <Pagination.Navigator type="next" />
            </Pagination>
          )}
        </Tabs.Pannel>

        <Tabs.Pannel index={2} className={style.pennel_div}>
          {likePosts.length > 0 ? (
            likePosts.map((post) => (
              <div
                key={post._id}
                className={style.pennel_img_div}
                onClick={() => navigate(`/community/post/${post._id}`)}
              >
                {post.images.length > 0 ? (
                  <img
                    src={post.images[0]}
                    className={style.tabs_img}
                    alt="좋아요 누른 게시물 이미지"
                  />
                ) : (
                  <div className={style.tabs_img}>{post.description}</div>
                )}

                <div className={style.info}>
                  <div className={style.comment}>
                    <img
                      src={"/images/comment_white.png"}
                      alt="게시물 이미지"
                    />
                    {post.comments.length}
                  </div>
                  <div className={style.likes}>
                    <img src={"/images/like_white.png"} alt="게시물 댓글" />
                    {post.likes.length}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p>게시글이 없습니다.</p>
          )}
          {likePosts.length > 0 && (
            <Pagination
              page={currentLikePage}
              totalPages={totalLikePage}
              startPage={1}
              endPage={totalLikePage}
              setPage={setCurrentLikePage}
              className={style.pagination}
            >
              <Pagination.Navigator type="prev" />
              <Pagination.PageButtons />
              <Pagination.Navigator type="next" />
            </Pagination>
          )}
        </Tabs.Pannel>
      </Tabs.MenuList>
    </Tabs.Root>
  );
};

export default UserPosts;
