import userAuthStore from "@/zustand/userAuth";
import style from "./menu.module.css";
import { useNavigate } from "react-router-dom";
import { useMemo } from "react";
// import profileImg from "/images/profile.png";
import { Button } from "@/components";
import { logout } from "@/apis/profile.api";

const Menu = () => {
  const user = userAuthStore();
  const { userImage, userNickName } = user;
  const isLoggined = useMemo(() => {
    return user.userId !== null;
  }, [user.userId]);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const response = await logout();
      if (response) {
        userAuthStore.setState({
          userId: null,
          userEmail: null,
          userNickName: "",
          userImage: null,
          userPet: null,
        });
        navigate("/login");
      }
    } catch (error) {
      console.error("로그아웃 실패", error);
    }
  };

  return (
    <div className={style.menu_total_wrap}>
      {isLoggined ? (
        <div className={style.profile}>
          <div
            className={style.profile_user}
            onClick={() => navigate("/profile")}
          >
            <img src={userImage || "/images/profile.png"} />
            <p>{userNickName}</p>
          </div>
          <div>
            <Button onClick={() => handleLogout()}>LOGOUT</Button>
          </div>
        </div>
      ) : (
        <div className={style.profile}>
          <div
            className={style.profile_user}
            onClick={() => navigate("/login")}
          >
            <img src={"/images/profile.png"} />
            <p>{"로그인이 필요합니다."}</p>
          </div>
          <div>
            <Button onClick={() => navigate("/login")}>LOGIN</Button>
          </div>
        </div>
      )}

      <div className={style.menuList}>
        <div className={style.subject}>
          <p>커뮤니티케이션 ＞</p>
          <div>
            <a>
              <span onClick={() => navigate("/petfriends")}>💬 펫프렌즈</span>
            </a>
            <a>
              <span onClick={() => navigate("/community")}>✍️ 커뮤니티</span>
            </a>
          </div>
        </div>
        <div className={style.subject}>
          <p>산책 ＞</p>
          <div>
            <a>
              <span onClick={() => navigate("/petwalk")}>👣 산책 기록</span>
            </a>
          </div>
        </div>
        <div className={style.subject}>
          <p>정보 ＞</p>
          <div>
            <a>
              <span onClick={() => navigate("/petmedi")}>🩺 병원/ 💊 약국</span>
            </a>
            <a>
              <span onClick={() => navigate("/petfuneral")}>🏢 장묘업체</span>
            </a>
            <a>
              <span onClick={() => navigate("/petplace")}>
                🚘 반려동반 장소
              </span>
            </a>
            <a>
              <span onClick={() => navigate("/petfood")}>🍏 식재료 성분</span>
            </a>
          </div>
        </div>
        <div className={style.subject}>
          <p>이벤트 ＞</p>
          <div>
            <a onClick={() => navigate("/roulette")}>
              <span>🎡 펫네임룰렛</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Menu;
