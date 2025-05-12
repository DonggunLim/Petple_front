import style from "../Profile/profile.module.css";
import { Carousel } from "@/components";
import SelectedProfileForm from "./components/SelectedProfileForm";
import { Helmet } from "react-helmet-async";
import SelectedUserPosts from "./components/SelectedUserPosts";
import SelectedUserPetForm from "./components/SelectedUserPetForm";
import { useParams } from "react-router-dom";
import { getUserByNickname } from "@/apis/profile.api";
import { useEffect, useState } from "react";
import { SelectedUser } from "@/types/user.type";

const SelectedProfile = () => {
  const { nickname } = useParams<string>();
  const [user, setUser] = useState<SelectedUser>();

  const params = async (nickname: string) => {
    const user = await getUserByNickname(nickname);

    if (user) {
      setUser(user);
    }
  };

  useEffect(() => {
    if (!nickname) return;
    params(nickname);
  }, []);

  return (
    <div className={style.profile_total_wrap}>
      <Helmet>
        <title>{`${nickname}님의 프로필 | PetPle`}</title>
        <meta name="description" content={`${nickname}님의 프로필입니다.`} />
      </Helmet>
      <SelectedProfileForm
        userNickName={nickname!}
        userImage={user?.profileImage!}
      />
      <div className={style.pet_wrap}>
        <div className={style.pet_div}>
          <div>
            <p>{nickname}님의 반려동물 🐾</p>
          </div>
        </div>
        <Carousel className={style.carousel}>
          <Carousel.ItemList>
            {user?.userPet?.map((pet, index) => (
              <Carousel.Item key={index} index={index}>
                <SelectedUserPetForm
                  id={pet.id}
                  name={pet.name}
                  age={pet.age}
                  image={pet.image}
                  breed={pet.breed}
                />
              </Carousel.Item>
            ))}
          </Carousel.ItemList>
          {(user?.userPet?.length ?? 0) >= 2 && (
            <Carousel.Indicator className={style.indicator} />
          )}
        </Carousel>
      </div>
      <SelectedUserPosts userNickName={nickname!} />
    </div>
  );
};

export default SelectedProfile;
