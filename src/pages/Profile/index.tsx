import userAuthStore from "@/zustand/userStore";
import { Carousel } from "@/components";
import style from "./profile.module.css";
import { useNavigate } from "react-router-dom";
import PetForm from "@/pages/Profile/components/PetForm";
import UserProfileForm from "@/pages/Profile/components/UserProfileForm";
import UserPosts from "./components/UserPosts";

const Profile = () => {
  const { userPet } = userAuthStore();

  const navigate = useNavigate();

  const handleAddPetProfile = () => {
    navigate("/createpet");
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
      <UserPosts />
    </div>
  );
};

export default Profile;
