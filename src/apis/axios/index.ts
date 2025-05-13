import useuseUserStore from "@/zustand/userStore";
import axios, { AxiosError } from "axios";

const baseInstance = axios.create({
  baseURL:
    import.meta.env.MODE === "production"
      ? `${import.meta.env.VITE_API_BASE_URL}/api`
      : "/api",
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

baseInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError) => {
    if (error.response) {
      const message = (error.response.data as { message: string }).message;
      switch (error.response.status) {
        case 400:
          console.error(message ?? "잘못된 요청입니다.");
          break;
        case 401:
          console.error(message ?? "인증 실패: 권한이 없습니다.");

          useuseUserStore.getState().clearUser();
          localStorage.clear();

          window.location.href = "/login";
          break;
        case 403:
          console.error(message ?? "접근 금지: 권한이 없습니다.");
          break;
        case 404:
          console.error(message ?? "요청한 리소스를 찾을 수 없습니다.");
          break;
        case 500:
          console.error(message ?? "서버 내부 오류가 발생했습니다.");
          break;
        default:
          console.error(`알 수 없는 오류: ${error.response.status}`);
      }
    } else if (error.request) {
      console.error("서버로부터 응답이 없습니다.");
    } else {
      console.error("요청 설정 중 에러 발생");
    }
    return Promise.reject(error);
  }
);

export default baseInstance;
