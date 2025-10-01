import { create } from "zustand";
import { createAuthSlice, AuthState } from "./authSlice";

type AppState = AuthState;

export const useAppStore = create<AppState>()((...a) => ({
  ...createAuthSlice(...a),
}));

