import { recieveUserInfo } from "@/apis/profile.api";
import useUserStore from "@/zustand/userStore";
import { QueryClient } from "@tanstack/react-query";

const getUserInfoLoader = async (QueryClient: QueryClient) => {
  const loginStatus = JSON.parse(
    localStorage.getItem("loginStatus") || "false"
  );
  if (!loginStatus) {
    return null;
  }
  try {
    const user = await QueryClient.fetchQuery({
      queryKey: ["userInfo"],
      queryFn: recieveUserInfo,
    });
    useUserStore.getState().setUser(user);
    return user;
  } catch (error) {
    return null;
  }
};

export default getUserInfoLoader;
