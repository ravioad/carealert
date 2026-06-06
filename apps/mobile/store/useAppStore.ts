import { create } from "zustand";

interface AppStore {
  token: string | null;
  user: { id: string; email: string; name: string } | null;
  isOnline: boolean;
  setAuth: (token: string, user: AppStore["user"]) => void;
  clearAuth: () => void;
  setOnline: (status: boolean) => void;
}

export const useAppStore = create<AppStore>((set) => ({
  token: null,
  user: null,
  isOnline: true,
  setAuth: (token, user) => set({ token, user }),
  clearAuth: () => set({ token: null, user: null }),
  setOnline: (status) => set({ isOnline: status }),
}));
