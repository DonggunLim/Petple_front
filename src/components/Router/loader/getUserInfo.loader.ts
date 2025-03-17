import { recieveUserInfo } from "@/apis/profile.api";
import userAuthStore from "@/zustand/userAuth";
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
    userAuthStore.setState({
      userId: user.id,
      userEmail: user.email,
      userNickName: user.nickName,
      userImage: user.image,
      userPet: user.pet,
      userAddress: user.address,
    });
    return user;
  } catch (error) {
    return null;
  }
};

export default getUserInfoLoader;
