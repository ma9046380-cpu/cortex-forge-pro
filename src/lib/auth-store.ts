import { create } from "zustand";
import type { Session, User } from "@supabase/supabase-js";

type AuthState = {
  session: Session | null;
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
  setSession: (s: Session | null) => void;
  setIsAdmin: (v: boolean) => void;
  setLoading: (v: boolean) => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  session: null,
  user: null,
  loading: true,
  isAdmin: false,
  setSession: (s) => set({ session: s, user: s?.user ?? null }),
  setIsAdmin: (v) => set({ isAdmin: v }),
  setLoading: (v) => set({ loading: v }),
}));
