import { AddressType } from "@/types/user.type";
import baseInstance from "./axios";

const logout = async () => {
  try {
    const response = await baseInstance.post("/oauth/logout");

    if (response.data.success) {
      return true;
    }
    return false;
  } catch (error) {
    throw error;
  }
};

const checkNickName = async (nickName: string) => {
  try {
    const response = await baseInstance.post("/my/nickname/check", {
      nickName,
    });

    if (response.data.success) {
      return true;
    }
    return false;
  } catch (error) {
    throw error;
  }
};

const recieveUserInfo = async () => {
  try {
    const response = await baseInstance.get("/my/info");

    const user = response.data.user;
    return user;
  } catch (error) {
    throw error;
  }
};

const updateUserInfo = async (
  userEmail: string | null,
  userNickName: string | null,
  imageUrl: string | null,
  selectedAddress: AddressType | null
) => {
  try {
    const response = await baseInstance.post("/my/info/update", {
      userEmail,
      userNickName,
      profileImage: imageUrl,
      selectedAddress,
    });

    if (response.data.success) {
      return true;
    }
    return false;
  } catch (error) {
    throw error;
  }
};

const createPet = async (userId: string, petData: any, imageUrl: string) => {
  try {
    const response = await baseInstance.post("/my/pet/create", {
      userId,
      formData: petData,
      image: imageUrl,
    });

    return response.data.pet;
  } catch (error) {
    throw error;
  }
};

const updatePetInfo = async (
  userId: string,
  petData: any,
  _id: string,
  imageUrl: string
) => {
  try {
    const response = await baseInstance.post(`/my/pet/${_id}`, {
      userId: userId,
      userPet: petData,
      petId: _id,
      petImage: imageUrl,
    });

    return response.data.pet;
  } catch (error) {
    throw error;
  }
};

const deletePet = async (userId: string, _id: string) => {
  try {
    const response = await baseInstance.delete(`/my/pet/${_id}`, {
      data: {
        userId: userId,
        petId: _id,
      },
    });

    if (response.data.success) {
      return true;
    }
    return false;
  } catch (error) {
    throw error;
  }
};

const getMyPosts = async () => {
  try {
    const response = await baseInstance.get("/my/posts/get");
    return response.data;
  } catch (error) {
    throw error;
  }
};

const getNearUsers = async (data: { lat: number; lng: number }) => {
  try {
    const response = await baseInstance.get(
      `/my/near?lat=${data.lat}&lng=${data.lng}`
    );
    return response.data.users;
  } catch (error) {
    throw error;
  }
};

const getUserByNickname = async (nickname: string) => {
  try {
    const response = await baseInstance.get(`/my/${nickname}`);
    return response.data.user;
  } catch (error) {
    throw error;
  }
};

const getCoordinate = async (address: string) => {
  try {
    const response = await baseInstance.get(`/my/coordinate/${address}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export {
  updateUserInfo,
  checkNickName,
  createPet,
  updatePetInfo,
  deletePet,
  recieveUserInfo,
  getMyPosts,
  getNearUsers,
  getUserByNickname,
  logout,
  getCoordinate,
};
