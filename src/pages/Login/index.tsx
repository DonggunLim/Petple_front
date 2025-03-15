import style from "./signup.module.css";
import Kakao from "@/assets/icons/btn_kakao.svg?react";

const Login = () => {
  const handleGoogleLogin = () => {
    window.location.href = "https://port-0-petple-back-m88kac3b6f77b35d.sel4.cloudtype.app/api/oauth/google";
  };

  const handleKakaoLogin = () => {
    window.alert('현재 배포 상태에서는 구글 로그인만 사용가능합니다.)
    // window.location.href = "/api/oauth/kakao";
  };

  const handleNaverLogin = () => {
    window.alert('현재 배포 상태에서는 구글 로그인만 사용가능합니다.)
    // window.location.href = "/api/oauth/naver";
  };

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
        </ul>
      </div>
    </div>
  );
};

export default Login;
