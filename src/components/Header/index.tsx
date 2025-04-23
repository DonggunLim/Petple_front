import { useNavigate } from "react-router-dom";
import style from "./header.module.css";
import userAuthStore from "@/zustand/userAuth";
import { useQueryClient } from "@tanstack/react-query";
import Avartar from "../UI/Avartar";
import { logout } from "@/apis/profile.api";
import AlarmDropdown from "../UI/Dropdown/AlarmDropdown";

const Header = () => {
  const navigate = useNavigate();
  const { userImage } = userAuthStore();
  const queryClient = useQueryClient();

  const loginStatus = JSON.parse(
    localStorage.getItem("loginStatus") || "false"
  );

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
        queryClient.removeQueries({ queryKey: ["userInfo"] });
        localStorage.clear();
        navigate("/login");
      }
    } catch (error) {
      console.error("로그아웃 실패", error);
    }
  };

  return (
    <header className={style.total_wrap}>
      <div className={style.content}>
        <div>
          <a onClick={() => navigate("/")}>
            <img
              src={"/images/logo.png"}
              className={style.img}
              alt="펫플 로고 이미지"
            />
          </a>
        </div>
        <ul>
          {loginStatus ? (
            <>
              <li className={style.login}>
                <a onClick={handleLogout}>LOGOUT</a>
              </li>
              <li>
                <Avartar
                  onClick={() => navigate("/profile")}
                  image={userImage!}
                  className={style.avartar}
                />
              </li>
              <li>
                <AlarmDropdown />
              </li>
            </>
          ) : (
            <>
              <li className={style.login}>
                <a onClick={() => navigate("/login")}>LOGIN</a>
              </li>
            </>
          )}
        </ul>
      </div>
    </header>
  );
};

export default Header;
