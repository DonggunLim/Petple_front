import { PostItem } from "./post.type";

export type Pet = {
  id?: string;
  age: string;
  name: string;
  image?: string;
  breed: string;
};

export type SignupFields = {
  email: string;
  name: string;
  password: string;
  passwordConfirm: string;
};

export type LoginFields = {
  email: string;
  password: string;
};

export type AuthStore = {
  userId: string | null;
  setUserId: (userId: string) => void;
  userEmail: string | null;
  setUserEmail: (userEmail: string) => void;
  userNickName?: string | null;
  setUserNickName?: (nickName: string) => void;
  userImage?: string | null;
  setUserImage?: (image: string) => void;
  userPet?: Pet[] | null;
  setUserPet: (pets: Pet[]) => void;
  petId: string | null;
  userAddress: AddressType | null;
  setUserAddress: (address: AddressType) => void;
};

export type SelectedUser = {
  userNickName?: string | null;
  setUserNickName?: (nickName: string) => void;
  profileImage?: string | null;
  setProfileImage?: (image: string) => void;
  userPet?: Pet[] | null;
  setUserPet: (pets: Pet[]) => void;
};

export interface AddressType {
  jibun_address: string;
  lng: number;
  lat: number;
}

export type ChatUser = {
  _id: string;
  name: string;
  email: string;
  nickName: string;
  profileImage: string;
};

export type UserType = {
  id: number;
  email: string;
  name: string;
  nickname: string;
  profileImage: string;
  jibun_address: string;
  location_coordinates_lat: number;
  location_coordinates_lng: number;
  userType: string;
  pets: Array<PetType>;
  created_at: string;
  updated_at: string;
};

export type PetType = {
  name: string;
  age: string;
  image: string;
  breed: string;
  id: string;
};

export type userPostsResponse = {
  userPosts: {
    posts: PostItem[];
    totalPages: number;
  };
};

export type LikePostsResponse = {
  likePosts: {
    posts: PostItem[];
    totalPages: number;
  };
};
