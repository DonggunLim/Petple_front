import { useNavigate } from "react-router-dom";
import style from "./header.module.css";
import userStore from "@/zustand/userStore";
import { useQueryClient } from "@tanstack/react-query";
import Avartar from "../UI/Avartar";
import AlarmDropdown from "../UI/Dropdown/AlarmDropdown";
import { useAlarmStore } from "@/zustand/alarmStore";
import { getAlarmList } from "@/apis/alarm.api";
import { useEffect } from "react";

const Header = () => {
  const navigate = useNavigate();
  const { user, clearUser } = userStore();
  const queryClient = useQueryClient();
  const { addAlarm } = useAlarmStore();
  const loginStatus = JSON.parse(
    localStorage.getItem("loginStatus") || "false"
  );

  const handleLogout = async () => {
    clearUser();
    queryClient.removeQueries({ queryKey: ["userInfo"] });
    localStorage.clear();
  };

  useEffect(() => {
    if (user) {
      getAlarmList(user.id) //
        .then(addAlarm);
    }
  }, [user]);

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
                  image={user?.profileImage!}
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
