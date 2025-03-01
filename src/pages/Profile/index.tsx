import userAuthStore from "@/zustand/userAuth";
import { Button, Carousel, Tabs } from "@/components";
import { useEffect, useState } from "react";
import style from "./profile.module.css";
// import plus from "/images/plus.png";
import { useNavigate } from "react-router-dom";
import PetForm from "@/pages/Profile/components/PetForm";
// import commentIcon from "/images/icons/comment.svg";
// import like from "/images/icons/like.svg";
import { getMyPosts } from "@/apis/profile.api";
import { PostItem } from "@/types/post.type";
import usePagination from "@/components/UI/Pagination/hooks/usePaginationData";
import UserProfileForm from "@/pages/Profile/components/UserProfileForm";
import Pagination from "@/components/UI/Pagination";

const Profile = () => {
  const { userPet } = userAuthStore();

  const navigate = useNavigate();

  const [posts, setPosts] = useState<PostItem[]>([]);
  const [likePosts, setLikePosts] = useState<PostItem[]>([]);
  const {
    page,
    setPage,
    paginatedData: paginatedPosts,
    totalPages,
  } = usePagination(posts);
  const {
    page: likePage,
    setPage: setLikePage,
    paginatedData: paginatedLikePosts,
    totalPages: likeTotalPages,
  } = usePagination(likePosts);

  useEffect(() => {
    getPosts();
  }, []);

  // petForm 추가
  const handleAddPetProfile = () => {
    navigate("/createpet");
  };

  //게시물 가져오기
  const getPosts = async () => {
    try {
      const response = await getMyPosts();
      if (response) {
        const likePosts = response.likePosts || [];
        const myPosts = response.posts || [];
        setPosts(myPosts);
        setLikePosts(likePosts);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className={style.profile_total_wrap}>
      <UserProfileForm />
      <div className={style.pet_wrap}>
        <div className={style.pet_div}>
          <div>
            <p>나의 반려동물 🐾</p>
          </div>
          <img
            src={"/images/plus.png"}
            className={style.plus}
            onClick={handleAddPetProfile}
            alt="반려동물 프로필 추가하기"
          />
        </div>
        <Carousel className={style.carousel}>
          <Carousel.ItemList>
            {userPet?.map((pet, index) => (
              <Carousel.Item key={index} index={index}>
                <PetForm
                  _id={pet._id}
                  name={pet.name}
                  age={pet.age}
                  image={pet.image}
                  breed={pet.breed}
                />
              </Carousel.Item>
            ))}
          </Carousel.ItemList>
          {(userPet?.length ?? 0) >= 2 && (
            <Carousel.Indicator className={style.indicator} />
          )}
        </Carousel>
      </div>
      <Tabs.Root className={style.tabs_root}>
        <Tabs.MenuList className={style.tabs_menulist}>
          <Tabs.Menu index={1}>
            <Button className={style.tabs_button}>작성한 게시글</Button>
          </Tabs.Menu>
          <Tabs.Menu index={2}>
            <Button className={style.tabs_button}>좋아요 게시글</Button>
          </Tabs.Menu>
        </Tabs.MenuList>
        <Tabs.MenuList>
          <Tabs.Pannel index={1} className={style.pennel_div}>
            {paginatedPosts.length > 0 ? (
              paginatedPosts.map((post) => (
                <div
                  key={post._id}
                  className={style.pennel_img_div}
                  onClick={() => navigate(`/community/post/${post._id}`)}
                >
                  <img
                    src={post.images[0]}
                    className={style.tabs_img}
                    alt="내 게시물 이미지"
                  />
                  <div className={style.info}>
                    <div className={style.comment}>
                      <img
                        src={"/images/comment_white.png"}
                        alt="게시물 댓글"
                      />
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
            <div className={style.pagination_container}>
              <Pagination
                page={page}
                totalPages={totalPages}
                startPage={1}
                endPage={totalPages}
                setPage={setPage}
              />
            </div>
          </Tabs.Pannel>

          <Tabs.Pannel index={2} className={style.pennel_div}>
            {paginatedLikePosts.length > 0 ? (
              paginatedLikePosts.map((post) => (
                <div
                  key={post._id}
                  className={style.pennel_img_div}
                  onClick={() => navigate(`/community/post/${post._id}`)}
                >
                  <img
                    src={post.images[0]}
                    className={style.tabs_img}
                    alt="좋아요 누른 게시물 이미지"
                  />
                  <div className={style.info}>
                    <div className={style.comment}>
                      <img
                        src={"/images/icons/comment.svg"}
                        alt="게시물 이미지"
                      />
                      {post.comments.length}
                    </div>
                    <div className={style.likes}>
                      <img src={"/images/icons/like.svg"} alt="게시물 댓글" />
                      {post.likes.length}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p>게시글이 없습니다.</p>
            )}
            <Pagination
              page={likePage}
              totalPages={likeTotalPages}
              startPage={1}
              endPage={likeTotalPages}
              setPage={setLikePage}
            >
              <Pagination.Navigator type="prev" />
              <Pagination.PageButtons />
              <Pagination.Navigator type="next" />
            </Pagination>
          </Tabs.Pannel>
        </Tabs.MenuList>
      </Tabs.Root>
    </div>
  );
};

export default Profile;
