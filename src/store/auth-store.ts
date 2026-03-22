import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { setAccessToken } from "@/services/session";
import type { UserMe } from "@/services/types";

type AuthState = {
  token: string | null;
  refreshToken: string | null;
  user: UserMe | null;
  setSession: (
    accessToken: string,
    user: UserMe,
    refreshToken?: string | null
  ) => void;
  setUser: (user: UserMe) => void;
  setRefreshToken: (t: string | null) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      refreshToken: null,
      user: null,
      setSession: (accessToken, user, refreshToken = null) => {
        setAccessToken(accessToken);
        set({
          token: accessToken,
          user,
          refreshToken: refreshToken ?? null,
        });
      },
      setUser: (user) => set({ user }),
      setRefreshToken: (refreshToken) => set({ refreshToken }),
      logout: () => {
        setAccessToken(null);
        set({ token: null, refreshToken: null, user: null });
      },
    }),
    {
      name: "banksphere-auth",
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({
        token: s.token,
        refreshToken: s.refreshToken,
        user: s.user,
      }),
      onRehydrateStorage: () => (state) => {
        if (state?.token) setAccessToken(state.token);
        else setAccessToken(null);
      },
    }
  )
);
