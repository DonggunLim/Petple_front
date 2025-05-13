import { useEffect } from "react";
import style from "./signup.module.css";
import Kakao from "@/assets/icons/btn_kakao.svg?react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { fetchGoolgeCallback, signinWithGuest } from "@/apis/login.api";

const Login = () => {
  const [searchParams] = useSearchParams();
  const code = searchParams.get("code");
  const navigate = useNavigate();
  const handleGoogleLogin = () => {
    const url =
      import.meta.env.MODE === "production"
        ? `${import.meta.env.VITE_API_BASE_URL}/api/oauth/google`
        : "/api/oauth/google";
    window.location.href = url;
  };

  const handleKakaoLogin = () => {
    window.alert("현재 배포 상태에서는 구글 로그인만 사용가능합니다.");
    // window.location.href = "/api/oauth/kakao";
  };

  const handleNaverLogin = () => {
    window.alert("현재 배포 상태에서는 구글 로그인만 사용가능합니다.");
    // window.location.href = "/api/oauth/naver";
  };

  const handleGuestLogin = () => {
    signinWithGuest() //
      .then(() => {
        localStorage.loginStatus = "true";
        navigate("/", { replace: true });
      });
  };

  useEffect(() => {
    if (!code) return;
    fetchGoolgeCallback(code) //
      .then(() => {
        localStorage.loginStatus = "true";
        navigate("/", { replace: true });
      });
  }, [code]);

  return (
    <div className={style.total_wrap}>
      <div className={style.content}>
        <ul>
          <div className={style.oauth_btn}>
            <a onClick={handleGoogleLogin} className={style.googleBtn}>
              <img
                src={"/images/googleCircle.png"}
                className={style.img}
                alt="구글 자동 로그인"
              />
            </a>
            <a onClick={handleKakaoLogin}>
              <Kakao className={style.img} />
            </a>
            <a onClick={handleNaverLogin}>
              <img
                src={"/images/btn_naver.png"}
                className={style.img}
                alt="네이버 자동 로그인"
              />
            </a>
          </div>
          <div className={style.oauth}>
            <p>sns로 로그인하기</p>
          </div>
          <p className={style.guestLogin} onClick={handleGuestLogin}>
            🚀 게스트 로그인하기
          </p>
        </ul>
      </div>
    </div>
  );
};

export default Login;
