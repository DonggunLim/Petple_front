import { create } from "zustand";
import { UserType } from "@/types/user.type";

interface useUserStore {
  user: UserType | null;
  setUser: (user: Partial<UserType>) => void;
  clearUser: () => void;
}

const useuseUserStore = create<useUserStore>((set) => ({
  user: null,
  setUser: (user: Partial<UserType>) =>
    set((state) => ({
      user: state.user ? { ...state.user, ...user } : { ...(user as UserType) },
    })),
  clearUser: () => set(() => ({ user: null })),
}));

export default useuseUserStore;
