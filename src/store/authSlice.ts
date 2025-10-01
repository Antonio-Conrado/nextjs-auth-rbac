import { UserProfile } from "@/features/auth/schemas/profileSchema";
import { StateCreator } from "zustand";

export type AuthState = {
  user: UserProfile | null;
  setUser: (user: AuthState["user"]) => void;
  clearAuth: () => void;
};

export const createAuthSlice: StateCreator<AuthState, [], [], AuthState> = (
  set
) => ({
  user: null,
  setUser: (user) => set({ user }),
  clearAuth: () => set({ user: null }),
});
