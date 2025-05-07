import { PostItem } from "./post.type";

export type Pet = {
  _id?: string;
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
  jibunAddress: string;
  location: {
    type: "Point";
    coordinates: [number | null, number | null];
  };
}

export type ChatUser = {
  _id: string;
  name: string;
  email: string;
  nickName: string;
  profileImage: string;
};

export type UserType = {
  id: string;
  email: string;
  name: string;
  nickName: string;
  profileImage: string;
  address: {
    jibunAddress: string;
    location: {
      type: "Point";
      coordinates: Array<number>;
    };
  };
  userType: string;
  userPet: Array<PetType>;
  createdAt: string;
  updatedAt: string;
};

export type PetType = {
  name: string;
  age: string;
  image: string;
  breed: string;
  _id: string;
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
