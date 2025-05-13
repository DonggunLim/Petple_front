import useUserStore from "@/zustand/userStore";
import style from "./avartar.module.css";
import { FC } from "react";
import { useNavigate, useParams } from "react-router-dom";

interface AvartarProps {
  onClick?: () => void;
  className?: string | null;
  image?: string;
  alt?: string;
  creator?: {
    id: number;
    name: string;
    email: string;
    nickname: string;
    profileImage: string;
  };
}

const Avartar: FC<AvartarProps> = (props) => {
  const { onClick, className, alt, creator, image } = props;
  const { user } = useUserStore();
  const { nickname } = useParams<string>();
  const navigate = useNavigate();

  const handleAvatarClick = async () => {
    if (!creator) return;
    if (user?.nickname === creator.nickname || nickname) {
      return navigate("/profile");
    }

    return navigate(`/profile/${creator.nickname}`);
  };

  return (
    <>
      <a onClick={onClick || handleAvatarClick} className={style.a}>
        <img
          src={image}
          onError={(e) => (e.currentTarget.src = "/images/profile.png")}
          className={`${style.image} ${className}`}
          alt={alt ?? "프로필 이미지"}
          loading="lazy"
          decoding="async"
        />
      </a>
    </>
  );
};

export default Avartar;
