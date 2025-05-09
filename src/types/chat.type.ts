import { PetType } from "./user.type";

export type ChatMessageType = {
  from: {
    id: string;
    nickname: string;
    profileImage: string;
    pets: PetType[];
  };
  to: {
    id: string;
    nickname: string;
    profileImage: string;
    pets: PetType[];
  };
  content: string;
};
